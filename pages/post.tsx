import { Header, Loading } from '@/components'
import style from '@/styles/post/Post.module.css'
import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

const deleteIcon = {
  src: require('@/public/icons/close.svg'),
  alt: 'deleteIcon'
}

const post = () => {
  const router = useRouter();

  const [files, setFiles] = useState<Array<File>>([]);
  const [uploading, setUploading] = useState<boolean | undefined>(undefined);

  const uploadFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;

    if (uploadedFiles !== null) {
      const uploadedFileList = Array.prototype.slice.call(uploadedFiles);
      setFiles([ ...files, ...uploadedFileList ]);
      event.target.value = '';
    }
  }

  const deleteFile = (fileIndex: number) => {
    setFiles(files.filter((file, index) => index !== fileIndex));
  }

  const post = async () => {
    if (uploading === true) return;
    setUploading(true);

    const title = document.getElementById('title') as HTMLInputElement;
    const content = document.getElementById('content') as HTMLTextAreaElement;
    let directoryId = '';
    let json;
    let res;

    json = { title: title.value }
    res = await fetch('https://backfurry.vercel.app/createDirectory', {
      mode: 'cors',
      method: 'post',
      body: JSON.stringify(json),
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});

    if (res?.ok) {
      try {
        await res.json().then(parser => { directoryId = parser.data.id });
      } catch (Exception) { console.log(Exception); }
    }
    else {
      window.alert('서버 오류');
      return;
    }

    json = new FormData();
    json.append('id', directoryId);
    json.append('content', content.value);

    for (let file of files) {
      json.append('image', file);
    }

    res = await fetch('https://backfurry.vercel.app/post', {
      mode: 'cors',
      method: 'post',
      body: json
    });

    if (res?.ok) {
      window.alert('업로드 성공');
      router.push('/');
      setUploading(false);
    }
    else {
      setUploading(false);
      window.alert('서버 오류');
      return;
    }
  }

  return (
    <div className={`flex justifyCenter`}>
      <Loading active={uploading} />
      <div className={`lockMaxWidth fullWidth fullHeight flex flexColumn`}>
        <Header />
        <div className={`${style.bodyContainer}`}>
          <div className={`${style.bodyRow}`}>
            <input id="title" className={`text`} type="text" placeholder="제목" spellCheck={false} />
          </div>
          <div className={`${style.bodyRow}`}>
            <textarea id="content" className={`text`} rows={10} placeholder="설명" spellCheck={false} />
          </div>
          <div className={`${style.bodyRow} spaceBetween`}>
            <div className={`flex maxWidth`}>
              <input id="files" onChange={(event) => uploadFiles(event)} type="file" accept="image/*" multiple />
              <label className={`text`} htmlFor="files">파일 추가</label>
            </div>
            <div className={`flex maxWidth`}>
              <button className={`${style.submit} text`} onClick={post}>업로드</button>
            </div>
          </div>
          <div className={`${style.bodyRow} ${style.fileContainer}`}>
            {
              files.map((file, index) => (
                <div className={`flex`} key={index}>
                  <div className={`${style.file}`} onClick={() => deleteFile(index)}>
                    <p className={`description`}>{ file.name }</p>
                    <Image className={`${style.deleteIcon}`} src={deleteIcon.src} alt={deleteIcon.alt} />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default post;
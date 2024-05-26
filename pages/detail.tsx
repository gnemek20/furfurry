import { Header, Search } from '@/components';
import style from '@/styles/detail/Detail.module.css'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, KeyboardEvent } from 'react';

const detail = (serverSideProps: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const [images, setImages] = useState<Array<string>>([]);
  const [comments, setComments] = useState<Array<string>>([]);
  const [content, setContent] = useState<string>('');

  const [fileId, setFileId] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const getContent = async (id: string) => {
    const json = {
      fileId: id
    }

    const res = await fetch('https://backfurry.vercel.app/getFile', {
      mode: 'cors',
      method: 'post',
      body: JSON.stringify(json),
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});

    if (res?.ok) {
      try {
        await res.json().then(parser => { setContent(parser.data) });
      } catch (Exception) {
        window.alert('서버 오류');
        router.reload();
      }
    }
  }

  const getComments = async (id: string) => {
    setFileId(id);

    const json = {
      fileId: id
    }

    const res = await fetch('https://backfurry.vercel.app/getFile', {
      mode: 'cors',
      method: 'post',
      body: JSON.stringify(json),
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});

    if (res?.ok) {
      try {
        await res.json().then(parser => { setComments(parser.data.replace(/\r/g, '').split('\n\n')) });
      } catch (Exception) {
        window.alert('서버 오류');
        router.reload();
      }
    }
  }

  const updateComment = async (event?: KeyboardEvent<HTMLInputElement>) => {
    if (event) {
      if (event.key.toLowerCase() !== 'enter') return;
    }

    const target = document.getElementById('comment') as HTMLInputElement;
    if (target.value.replace(/ /g, '').length === 0 || fileId.length === 0 || uploading) return;
    setUploading(true);

    const json = {
      fileId: fileId,
      comments: comments,
      comment: target.value
    }

    const res = await fetch('https://backfurry.vercel.app/updateComment', {
      mode: 'cors',
      method: 'post',
      body: JSON.stringify(json),
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {
      window.alert('서버 오류');
      setUploading(false);
    });

    if (res?.ok) {
      window.alert('댓글이 추가되었습니다.');
      router.reload();
      setUploading(false);
    }
  }

  useEffect(() => {
    const posts = serverSideProps.posts || [];
    let array = new Array();
    
    posts.map((post: typeof serverSideProps.posts[0]) => {
      if (post.mimeType.includes('image')) array.push(`https://lh3.google.com/u/0/d/${post['id']}=w1920-h1080-iv1`);
      else if (post.name.includes('content')) getContent(post['id']);
      else if (post.name.includes('comments')) getComments(post['id']);
    });

    setImages(array);
  }, [serverSideProps]);

  useEffect(() => {
    const search = serverSideProps.search;

    if (search) {
      if (search === 'lost connection') {
        window.alert('서버 오류');
        router.reload();

        return;
      }
    }
  }, []);

  return (
    <div className={`flex justifyCenter`}>
      <div className={`lockMaxWidth fullWidth fullHeight flex flexColumn`}>
        <Header />
        <div className={`${style.bodyContainer}`}>
          <div className={`${style.bodyRow} ${style.titleContainer}`}>
            <h1 className={`heading`}>{ serverSideProps.name }</h1>
          </div>
          <div className={`${style.bodyRow} ${style.imageContainer}`}>
            {
              images.map((image, index) => (
                <img className={`${style.image}`} src={image} alt="구글 로그인을 해주세요!" key={index} />
              ))
            }
          </div>
          <div className={`${style.bodyRow} ${style.contentContainer}`}>
            <p className={`text`}>{ content }</p>
          </div>
        </div>
        <div className={`${style.footerContainer}`}>
          <div className={`${style.footerRow} ${style.commentInputContainer}`}>
            <input id='comment' className={`${style.commentInput} text`} onKeyDown={(event) => updateComment(event)} type="text" placeholder='댓글을 입력하세요' autoComplete='off' />
            <button className={`${style.commentSubmit} text`} onClick={() => updateComment()}>댓글 추가</button>
          </div>
          <div className={`${style.footerRow} ${style.commentContainer}`}>
            {
              comments?.map((comment, index) => (
                comment.length !== 0 && (
                  <div className={`${style.commentRow}`} key={index}>
                    <p className={`text`}>{ comment }</p>
                  </div>
                )
              ))
            }
          </div>
          <div className={`${style.footerRow} ${style.searchContainer}`}>
            <Search />
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = context.query['name'];
  const query = context.query['id'];
  let search = query;
  let result: Array<Object> = [];
  
  const json = { postId: query }

  const res = await fetch('https://backfurry.vercel.app/getPost', {
    mode: 'cors',
    method: 'post',
    body: JSON.stringify(json),
    headers: { 'Content-Type': 'application/json' }
  }).catch(() => { search = 'lost connection' });

  if (res?.ok) {
    try {
      await res.json().then(parser => { result = parser });
    } catch (Exception) {
      search = 'lost connection';
    }
  }

  return {
    props: {
      name: name,
      search: search,
      posts: result || '',
    }
  }
}

export default detail;
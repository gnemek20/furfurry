import { Header, Search } from '@/components';
import style from '@/styles/detail/Detail.module.css'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const detail = (serverSideProps: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const [images, setImages] = useState<Array<string>>([]);
  const [content, setContent] = useState<string>('');

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

  useEffect(() => {
    const posts = serverSideProps.posts || [];
    let array = new Array();
    
    posts.map((post: typeof serverSideProps.posts[0]) => {
      if (post.mimeType.includes('image')) array.push(`https://lh3.google.com/u/0/d/${post['id']}=w1920-h1080-iv1`);
      else if (post.mimeType.includes('text')) getContent(post['id']);
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
            <h1 className={`heading`}>{ serverSideProps.name } - { content }</h1>
          </div>
          <div className={`${style.bodyRow} ${style.imageContainer}`}>
            {
              images.map((image, index) => (
                <img className={`${style.image}`} src={image} alt="image" key={index} />
              ))
            }
          </div>
        </div>
        <div className={`${style.footerContainer}`}>
          <div className={`${style.footerRow}`}>
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
  let result;
  
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
      posts: result || ''
    }
  }
}

export default detail;
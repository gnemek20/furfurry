import style from '@/styles/detail/Detail.module.css'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const detail = (serverSideProps: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const [a, sa] = useState<string>('');

  useEffect(() => {
    const posts = serverSideProps.posts || [];
    
    posts.map((post: typeof serverSideProps.posts[0]) => {
      if (post.mimeType === 'image/jpeg') {
        sa(`https://drive.google.com/uc?export=view&id=${post['id']}`)
        const target: HTMLCanvasElement = document.getElementById('asd') as HTMLCanvasElement;
        const context = target.getContext('2d');

        let getImage = new Image();
        // getImage.src = `https://drive.google.com/uc?export=view&id=${post['id']}`;
        getImage.src = `https://drive.google.com/uc?export=view&id=1KKGsli_BanI1u35AZjFjA4azL-9YEg_g`;
        // getImage.src = `https://drive.google.com/file/d/1KKGsli_BanI1u35AZjFjA4azL-9YEg_g/view?usp=drive_link`;
        console.log(getImage)
        getImage.onload = () => {
          console.log('loaded')
          context?.drawImage(getImage, 0, 0, target.width, target.height);
        }
      }
    });

    const target: HTMLCanvasElement = document.getElementById('asd') as HTMLCanvasElement;
    const context = target.getContext('2d');
    
    let getImage = new Image();
    // getImage.src = `https://drive.google.com/uc?export=view&id=${post['id']}`;
    getImage.src = `https://drive.google.com/uc?export=view&id=1KKGsli_BanI1u35AZjFjA4azL-9YEg_g`;
    // getImage.src = `https://drive.google.com/file/d/1KKGsli_BanI1u35AZjFjA4azL-9YEg_g/view?usp=drive_link`;
    console.log(getImage)
    getImage.onload = () => {
      console.log('loaded')
      context?.drawImage(getImage, 0, 0, target.width, target.height);
    }
  }, [serverSideProps]);

  useEffect(() => {
    const search = serverSideProps.search;

    if (search) {
      // if (search === 'lost connection') {
      //   window.alert('서버 오류');
      //   router.reload();

      //   return;
      // }
    }
  }, []);

  return (
    <div className={`flex justifyCenter`}>
      <div className={`lockMaxWidth fullWidth fullHeight flex flexColumn`}>
        <div className={`${style.titleContainer}`}>
          <h1 className={`heading`}></h1>
        </div>
        <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" />
        <img src="https://drive.google.com/file/d/1KKGsli_BanI1u35AZjFjA4azL-9YEg_g/view" />
        <canvas id='asd' />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query['id'];
  let search = query;
  let result;
  
  const json = { postId: query }

  const res = await fetch('http://localhost:3000/drive/getPost', {
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
      search: search,
      posts: result || ''
    }
  }
}

export default detail;
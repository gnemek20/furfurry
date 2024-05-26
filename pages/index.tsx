import { Header, Search } from '@/components'
import style from '@/styles/Home.module.css'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const home = (serverSideProps: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  
  const [posts, setPosts] = useState<Array<Object>>([]);
  const [postCount, setPostCount] = useState<number>(0);

  useEffect(() => {
    const search = serverSideProps['search'];
    if (search.length === 0) {
      const target: HTMLInputElement = document.getElementById('searchInput') as HTMLInputElement;
      target.value = serverSideProps.search;
    }

    const list = serverSideProps.list as Array<Object>;
    setPosts(list);
    setPostCount(list.length);
  }, [serverSideProps])

  useEffect(() => {
    const search = serverSideProps['search'];

    if (search) {
      if (search === 'lost connection') {
        window.alert('서버 오류');
        router.reload();

        return;
      }

      const target: HTMLInputElement = document.getElementById('searchInput') as HTMLInputElement;
      target.value = serverSideProps.search;
    }
  }, []);

  return (
    <div className={`flex justifyCenter`}>
      <div className={`lockMaxWidth fullWidth fullHeight flex flexColumn`}>
        <Header />
        <div className={`${style.bodyContainer}`}>
          <div className={`${style.bodyRow}`}>
            <Search />
          </div>
          <div className={`${style.bodyRow} ${style.countText}`}>
            <p className={`description`}>{ postCount }개</p>
          </div>
          <div className={`${style.bodyRow} ${style.posts}`}>
            {
              posts.map((post: { name?: string, id?: string }, index) => (
                <div className={`${style.post}`} onClick={() => router.push(`/detail?id=${post['id']}&name=${post['name']}`)} key={index}>
                  <p className={`text`}>{ post['name'] }</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query: string = context.query['search'] as string || '';
  let search = query;
  let result;

  const json = { postName: query }

  const res = await fetch('https://backfurry.vercel.app/search', {
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
      list: result || []
    }
  }
}

export default home;
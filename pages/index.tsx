import style from '@/styles/Home.module.css'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'

const clearIcon = {
  src: require('@/public/icons/close.svg'),
  alt: 'clearIcon'
}

const home = (serverSideProps: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  let timeoutId: NodeJS.Timeout;
  const router = useRouter();
  
  const [posts, setPosts] = useState<Array<Object>>([]);
  const [postCount, setPostCount] = useState<number>(0);
  
  const clearSearchInputValue = () => {
    const target: HTMLInputElement = document.getElementById('searchInput') as HTMLInputElement;
    if (target.value === '') return;

    target.value = '';
    router.push('', undefined, { shallow: false });
  }
  
  const searchPost = (event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const postName = event.target.value.replace(/ /g, '');

      if (postName) router.push(`?search=${postName}`, undefined, { shallow: false });
      else router.push('', undefined, { shallow: false });
    }, 100);
  }

  useEffect(() => {
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
        <div className={`${style.headerContainer}`}>
          <div className={`${style.headerRow} justifyCenter`}>
            <h1 className={`heading`}>퍼퍼리 갤러리</h1>
          </div>
        </div>
        <div className={`${style.bodyContainer}`}>
          <div className={`${style.bodyRow}`}>
            <div className={`${style.searchContainer}`}>
              <input id="searchInput" className={`${style.searchInput} text`} onChange={(event) => searchPost(event)} type="text" placeholder='검색어를 입력하세요' />
              <Image className={`${style.clearIcon}`} onClick={clearSearchInputValue} src={clearIcon.src} alt={clearIcon.alt} />
            </div>
            <button className={`${style.addPostButton} text`}>게시글 추가</button>
          </div>
          <div className={`${style.bodyRow} ${style.countText}`}>
            <p className={`description`}>{ postCount }개</p>
          </div>
          <div className={`${style.bodyRow} ${style.posts}`}>
            {
              posts.map((post: { name?: string, id?: string }, index) => (
                <div className={`${style.post}`} onClick={() => router.push(`/detail?id=${post['id']}`)} key={index}>
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

  const res = await fetch('http://localhost:3000/drive/search', {
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
import style from '@/styles/Home.module.css'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect } from 'react'

const clearIcon = {
  src: require('@/public/icons/close.svg'),
  alt: 'clearIcon'
}

const home = (serverSideProps: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  let timeoutId: NodeJS.Timeout;
  const router = useRouter();

  const clearSearchInputValue = () => {
    const target: HTMLInputElement = document.getElementById('searchInput') as HTMLInputElement;
    target.value = '';

    router.push('', undefined, { shallow: false });
  }

  const searchPost = (event: ChangeEvent<HTMLInputElement>) => {
    clearInterval(timeoutId);

    timeoutId = setTimeout(() => {
      const postName = event.target.value;

      if (postName) router.push(`?search=${postName}`, undefined, { shallow: false });
      else router.push('', undefined, { shallow: false });
    }, 100);
  }

  return (
    <div className={`flex justifyCenter`}>
      <div className={`lockMaxWidth fullWidth fullHeight flex flexColumn`}>
        <div className={`${style.headerContainer}`}>
          <div className={`${style.headerRow} justifyCenter`}>
            <h1 className={`header`}>퍼퍼리 갤러리</h1>
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
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query['search'] || '';

  return {
    props: {
      search: query
    }
  }
}

export default home;
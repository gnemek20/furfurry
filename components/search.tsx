import style from '@/styles/search/Search.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent } from 'react'

const clearIcon = {
  src: require('@/public/icons/close.svg'),
  alt: 'clearIcon'
}

const search = () => {
  const router = useRouter();
  let timeoutId: NodeJS.Timeout;

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

      if (postName) router.push(`./?search=${postName}`, undefined, { shallow: false });
      else router.push('', undefined, { shallow: false });
    }, 100);
  }

  return (
    <div className={`${style.row}`}>
      <div className={`${style.searchContainer}`}>
        <input id="searchInput" className={`${style.searchInput} text`} onChange={(event) => searchPost(event)} type="text" placeholder='검색어를 입력하세요' autoComplete='off' autoFocus spellCheck={false} />
        <Image className={`${style.clearIcon}`} onClick={clearSearchInputValue} src={clearIcon.src} alt={clearIcon.alt} />
      </div>
      <button className={`${style.addPostButton} text`} onClick={() => router.push('/post')}>게시글 추가</button>
    </div>
  )
}

export default search;
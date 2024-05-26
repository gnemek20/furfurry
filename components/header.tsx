import style from '@/styles/header/Header.module.css'
import { useRouter } from 'next/router';

const header = () => {
  const router = useRouter();

  return (
    <div className={`${style.headerContainer}`}>
      <div className={`${style.headerRow} justifyCenter`}>
        <h1 className={`heading`} onClick={() => router.push('/')}>퍼퍼리 갤러리</h1>
      </div>
    </div>
  )
}

export default header;
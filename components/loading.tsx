import style from '@/styles/loading/Loading.module.css'
import animation from '@/styles/loading/animation.module.css'

interface props {
  active: boolean | undefined
}

const loading = ({ active }: props) => {
  return (
    <div id='loadingBackground' className={`${style.loadingBackground} ${active ? animation.fadeIn : (active !== undefined && animation.fadeOut) || (active === undefined && 'none')}`}>
      <div className={`${style.loadingContainer}`}>
        <div className={`${style.loadingRow}`}>
          <h1 className={`text`}>업로드 중이에요!</h1>
        </div>
        <div className={`${style.loadingRow} ${style.loadingAnimation}`}>
          <div className={`${style.circle}`}>
            <div className={`${style.bar} ${animation.barRotate}`} />
            <div className={`${style.cover}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default loading;
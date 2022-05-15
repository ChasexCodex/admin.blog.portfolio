import {ReactElement} from 'react'

const MainLayout = (page: ReactElement) => {
  return (
      <div className="flex flex-col min-h-screen w-screen">
        {page}
      </div>
  )
}

export default MainLayout

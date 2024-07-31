import React from 'react';
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const HomeworkProgressBar = ({ totalHW, checkedHW }) => {

  const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

  const progress = (checkedHW / totalHW) * 100;
  const style = {
    width: `${progress}%`,
    height: '15px',
    backgroundColor: '#3fbfa3',
    borderRadius: '0px',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', height: '15px', backgroundColor: '#ddd', borderRadius: '0px' }}>
        <div style={style}></div>
      </div>
    </div>
  )
}
export default HomeworkProgressBar
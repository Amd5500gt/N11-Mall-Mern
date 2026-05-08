import React from 'react'

const GoogleAuth = ({authMode}) => {
  return (
    <div>   {(authMode === 'login' || authMode === 'register') && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <div id="googleBtn"></div>
          </div>
        )}
    </div>
  )
}

export default GoogleAuth
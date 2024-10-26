import React from 'react';
import './Spinner.css'; // CSS for animation

export default function Spinner() {
  return (
    <div className="loading-container">
      <p className="loading-text">
        Loading<span className="dot1">.</span><span className="dot2">.</span><span className="dot3">.</span>
      </p>
    </div>
  );
}



























































// import React, { Component } from 'react';
// import loading5 from './loading5.gif'; // Spinner for dark mode
// import loading2 from './loading2.gif'; // Spinner for light mode

// export default class Spinner extends Component {
//   render() {
//     const { isDarkMode } = this.props;

//     return (
//       <div 
//         className="text-center" 
//         style={{ marginTop: '20px', padding: '10px', borderRadius: '5px' }}
//       >
//         <img 
//           className="my-3" 
//           src={isDarkMode ? loading5 : loading2} // Dynamically choose the spinner
//           alt="Loading, please wait..." 
//           style={{ width: '50px', height: '50px' }} 
//         />
//       </div>
//     );
//   }
// }

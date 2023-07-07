// import React, { useState, useEffect, useRef } from "react";
// import OpenModalButton from '../OpenModalButton';



// const DeleteSpot = ({onConfirm} ) => {
//     const [showMenu, setShowMenu] = useState(false);
//     const ulRef = useRef();

//     const handleDelete = () => {
//         onConfirm();
//         setShowMenu(false);
//     };

//     const openMenu = () => {
//         if (showMenu) return;
//         setShowMenu(true);
//     };

//     useEffect(() => {
//         if (!showMenu) return;

//         const closeMenu = (e) => {
//             if (!ulRef.current.contains(e.target)) {
//                 setShowMenu(false);
//             }
//         };

//         document.addEventListener('click', closeMenu);

//         return () => document.removeEventListener("click", closeMenu);
//     }, [showMenu]);

//     const closeMenu = () => setShowMenu(false);


//     return (
//         <>
//             <button className="Del" onClick={() => setShowMenu(true)}>
//                 Delete
//             </button>
//             {showMenu && (
//                 <OpenModalButton
//                     title="Confirm Delete"
//                     message="Are you sure you want to remove this spot?"
//                     confirmText="Yes (Delete Spot)"
//                     cancelText="No (Keep Spot)"
//                     onConfirm={handleDelete}
//                     onCancel={() => setShowMenu(false)}
//                 />
//             )}
//         </>
//     );
// }


// export default DeleteSpot

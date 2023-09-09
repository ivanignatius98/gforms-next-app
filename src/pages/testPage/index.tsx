import Layout from "@layouts/DefaultLayout";
import DragWrapper from "@modules/Drag";
import React, { useMemo, useCallback, useState, useEffect } from "react";

// const DragWrapper = ({ y, children, draggedItem }) => {
//   const [dragY, setDragY] = useState(y);

//   useEffect(() => {
//     setDragY(y);
//   }, [y]);

//   const handleDragging = useCallback((event) => {
//     const yCoordinate = event.clientY;
//     if (yCoordinate <= 0) {
//       return;
//     }
//     setDragY(yCoordinate);
//   }, []);

//   useEffect(() => {
//     if (draggedItem != null) {
//       window.addEventListener("mousemove", handleDragging);
//     }
//     return () => {
//       window.removeEventListener("mousemove", handleDragging);
//     };
//   }, [handleDragging, draggedItem]);

//   return (
//     <div className="relative">
//       <div style={{ top: dragY }} className="absolute z-20 w-full">
//         TEST {dragY} {draggedItem}
//         {children}
//       </div>
//     </div>
//   );
// };

const App = () => {
  const [dragY, setDragY] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  console.log("RERENDER")
  return (
    <Layout>
      <DragWrapper y={dragY} draggedItem={draggedItem}>
        test
      </DragWrapper>
      <button
        style={{
          height: 200,
          width: 200,
          backgroundColor: "aqua",
          zIndex: 200,
        }}
        onMouseDown={(e) => {
          setDraggedItem(1);
          setDragY(e.clientY);
        }}
      >
        test
      </button>
      test compo 2
    </ Layout>
  );
};

export default App;

import { useState } from "react";

const initialData = {
  id: 1,
  name: "NODEBOX",
  type: "folder",
  children: [
    {
      id: 2,
      name: "src",
      type: "folder",
      children: [{ id: 3, name: "App.js", type: "file" }],
    },
    { id: 4, name: "package.json", type: "file" },
  ],
};

export default function App() {
  const [data, setData] = useState(initialData);

  return (
    <div>
      <FileExplorer node={data} setData={setData} />
    </div>
  );
}

function FileExplorer({ node, setData }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleAdd = (type) => {
    if (node.type !== "folder") return;

    const name = prompt(`Enter ${type} name`);
    if (!name) return;

    const newNode = {
      id: Date.now(),
      name,
      type,
      children: type === "folder" ? [] : undefined,
    };

    setData((prev) => addNode(prev, node.id, newNode));
  };

  const handleDelete = () => {
    setData((prev) => deleteNode(prev, node.id));
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <div>
        {node?.type === "folder" ? (
          <span
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: "pointer" }}
          >
            {isOpen ? "📂" : "📁"} {node?.name}
          </span>
        ) : (
          <span>📄 {node?.name}</span>
        )}

        {node?.type === "folder" && (
          <>
            <button onClick={() => handleAdd("file")}>+File</button>
            <button onClick={() => handleAdd("folder")}>+Folder</button>
          </>
        )}

        <button onClick={handleDelete}>Delete</button>
      </div>

      {isOpen &&
        node?.children?.map((child) => (
          <FileExplorer key={child.id} node={child} setData={setData} />
        ))}
    </div>
  );
}

/* =========================
   Recursive Add Function
========================= */
function addNode(tree, parentId, newNode) {
  if (tree.id === parentId && tree.type === "folder") {
    return {
      ...tree,
      children: [...(tree.children || []), newNode],
    };
  }

  if (tree.children) {
    return {
      ...tree,
      children: tree.children.map((child) => addNode(child, parentId, newNode)),
    };
  }

  return tree;
}

/* =========================
   Recursive Delete Function
========================= */
function deleteNode(tree, nodeId) {
  if (tree.id === nodeId) return null;

  if (!tree.children) return tree;

  const updatedChildren = tree.children
    .map((child) => deleteNode(child, nodeId))
    .filter(Boolean);

  return {
    ...tree,
    children: updatedChildren,
  };
}

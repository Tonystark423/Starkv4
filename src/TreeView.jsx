import { useState } from "react";

export default function TreeView({ node, depth = 0, selectedPath, onSelect, path }) {
  const [open, setOpen] = useState(depth < 2);
  const isDir = node.type === "dir" || !!node.children;
  const currentPath = path ? `${path}/${node.name}` : node.name;

  return (
    <div className="font-mono text-[12px] leading-[1.6]">
      <div
        onClick={() => {
          onSelect(currentPath, node);
          if (isDir) setOpen(!open);
        }}
        className={`flex items-start gap-2 px-2 py-[3px] cursor-pointer border-l transition-colors
          ${selectedPath === currentPath ? "bg-[#1a2e1a] border-[#2f6b2f] text-[#b6e5b6]" : "border-transparent hover:bg-[#161616] text-[#9a9a9a] hover:text-[#d4d4d4]"}
        `}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        <span className="select-none text-[10px] mt-[2px] w-3">
          {isDir ? (open ? "▼" : "▶") : " "}
        </span>
        <span className={`${node.type === "file" ? "text-[#8a8a8a]" : "text-[#d4d4d4] font-medium"} truncate`}>
          {node.name}
        </span>
        {node.badge && (
          <span
            className={`ml-auto text-[9px] px-1.5 py-0.5 border leading-none shrink-0
            ${node.badge === "ANCHOR" ? "border-[#2f6b2f] text-[#5cb85c] bg-[#102110]" : ""}
            ${node.badge === "ROOT" ? "border-[#6b5b2f] text-[#c9a84a] bg-[#211d10]" : ""}
            ${node.badge === "CRITICAL" ? "border-[#6b2f2f] text-[#e05c5c] bg-[#211010]" : ""}
          `}
          >
            {node.badge}
          </span>
        )}
      </div>
      {isDir && open && node.children && (
        <div>
          {node.children.map((child, i) => (
            <TreeView key={i} node={child} depth={depth + 1} selectedPath={selectedPath} onSelect={onSelect} path={currentPath} />
          ))}
        </div>
      )}
    </div>
  );
}

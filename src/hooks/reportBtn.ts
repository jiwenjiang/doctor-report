import request from "@/service/request";
import { useEffect, useState } from "react";

export function reportBtnAuth() {
  const [auth, setAuth] = useState([]);

  function findNodeById(node, id) {
    if (node.id === id) {
      return node;
    } else if (node.child && node.child.length > 0) {
      for (let i = 0; i < node.child.length; i++) {
        const targetNode = findNodeById(node.child[i], id);
        if (targetNode) {
          return targetNode;
        }
      }
    }
    return null;
  }

  function findNameByIdPaths(arr, idPaths, result) {
    idPaths.forEach((path) => {
      const rootNode = findNodeById(arr[0], path[0]);
      if (rootNode) {
        let curr = rootNode;
        for (let i = 1; i < path.length; i++) {
          curr = findNodeById(curr, path[i]);
          if (!curr) {
            break;
          }
        }
        if (curr && curr.name) {
          result.push(curr.name);
        }
      }
    });
  }

  useEffect(() => {
    (async () => {
      const result: any = [];
      const res = await request({ url: "/permission/list" });
      const res2 = await request({
        url: "/permission/admin/user/list",
        data: { userId: JSON.parse(localStorage.user).id },
      });

      findNameByIdPaths(res.data, res2.data, result);
      setAuth(result);
    })();
  }, []);

  return auth;
}

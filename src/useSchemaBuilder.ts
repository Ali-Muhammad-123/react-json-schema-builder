import {cloneDeep, get, mapKeys, omit, set} from 'lodash';
import {useState} from 'react';
import {v4 as uuidv4} from 'uuid';

export default function useSchemaBuilder(schema: any) {
  const [tree, setTree] = useState(schema);

  function arrayToNamedObject(arr: any) {
    const result: any = {};
    arr.forEach((item: any, index: any) => {
      result[`Child ${index + 1}`] = item;
    });
    return result;
  }

  function addNode({path, childName}: {path: string[]; childName: string}) {
    const newTree = cloneDeep(tree);
    const parentNode = get(newTree, path);

    if (parentNode.properties) {
      parentNode.properties[childName] = {title: childName, type: 'string'};
    }
    if (parentNode.items) {
      if (Array.isArray(parentNode.items)) parentNode.items.push({type: 'string'});
      else if (Object.entries(parentNode.items).length > 0) {
        parentNode.items = [parentNode.items, {type: 'string'}];
      } else {
        parentNode.items = {type: 'string'};
      }
    }
    console.log(newTree);
    setTree(newTree);
  }

  function deleteNode({path}: {path: string[]}) {
    const newTree = cloneDeep(tree);
    const childName = path.pop();
    let parentNode = get(newTree, path);
    console.log(path);
    console.log(childName);
    if (Array.isArray(parentNode)) {
      if (parentNode.length > 2) {
        parentNode.splice(Number(childName), 1);
      } else {
        parentNode.splice(Number(childName), 1);
        parentNode = parentNode[0];
      }
    } else {
      if (childName) delete parentNode[childName];
    }
    console.log('parentNode', parentNode);
    set(newTree, path, parentNode);
    setTree(newTree);
  }

  function editNode({path, node}: {path: string[]; node: any}) {
    const newTree = cloneDeep(tree);
    if (node.name) {
      const nodeName = path.pop();
      let parentNode = get(newTree, path);
      const objMapper = (obj: any) => {
        const newObj = mapKeys(obj, (value, key) => {
          switch (key) {
            case nodeName:
              return node.name;
            default:
              return key;
          }
        });
        return newObj;
      };
      parentNode = objMapper(parentNode);
      parentNode[node.name].title = node.name;
      set(newTree, path, parentNode);
    } else if (node.type) {
      const parentNode = get(newTree, path);
      switch (parentNode.type) {
        case 'object':
          if (Object.entries(parentNode.properties).length > 0 && node.type !== 'array' && node.type !== 'object') {
            alert('Can not change object type with existing child properties');
            break;
          }
          if (node.type == 'array') {
            if (Object.entries(parentNode.properties).length > 1) {
              parentNode.items = Object.values(parentNode.properties);
            } else {
              parentNode.items = Object.values(parentNode.properties)[0] ?? {};
            }

            delete parentNode.properties;
            // omit(parentNode, 'properties');
            console.log(parentNode);
          } else if (node.type == 'object') {
            parentNode.properties = {};
            delete parentNode.items;
            // omit(parentNode, 'items');
          }
          parentNode.type = node.type;
          set(newTree, path, parentNode);
          break;

        case 'array':
          if (
            Array.isArray(parentNode.items) ?
              parentNode.items.length > 0 && node.type !== 'array' && node.type !== 'object'
            : Object.entries(parentNode.items).length > 0 && node.type !== 'array' && node.type !== 'object'
          ) {
            console.log(parentNode.items);
            alert('Can not change array type with existing child properties');
            break;
          } else if (node.type == 'object') {
            if (Array.isArray(parentNode.items)) {
              parentNode.properties = arrayToNamedObject(parentNode.items);
            } else {
              parentNode.properties = {'Child 1': parentNode.items};
            }
            // parentNode.properties = parentNode.items;
            delete parentNode.items;
            // omit(parentNode, 'items');
            console.log(parentNode);
          }
          parentNode.type = node.type;
          set(newTree, path, parentNode);
          break;
        default:
          if (node.type == 'array') {
            parentNode.items = {type: 'string'};
            delete parentNode.properties;
            // omit(parentNode, 'properties');
          } else if (node.type == 'object') {
            parentNode.properties = {};
            delete parentNode.items;

            // omit(parentNode, 'items');
          } else {
            delete parentNode.items;
            delete parentNode.properties;
          }
          parentNode.type = node.type;
          set(newTree, path, parentNode);
          break;
      }

      //   parentNode.type = node.type;
      //   set(newTree, path, parentNode);
    }
    console.log(newTree);
    setTree(newTree);
  }

  return {tree, addNode, editNode, deleteNode};
}

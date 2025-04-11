import { TreeNode } from "primeng/api";



export function  checkNode(nodes:TreeNode[],selectedFiles:TreeNode[], str:string[]):TreeNode[]{
    let resultado=[]
    for(let i=0 ; i < nodes.length ; i++) {
        if(!nodes[i].leaf && nodes[i].children[0]?.leaf) {
            for(let j=0 ; j < nodes[i].children?.length ; j++) {
                if(str.includes(nodes[i].children[j].data)) {
                    if(!selectedFiles.includes(nodes[i].children[j])){
                        selectedFiles.push(nodes[i].children[j]) ;
                        nodes[i].expanded = true;
                    }
                }
            }
        }
        if (nodes[i].leaf) {
            resultado=selectedFiles;
            return 
        }
        checkNode(nodes[i].children,selectedFiles, str);
        let count = nodes[i].children.length;
        let c = 0;
        for(let j=0 ; j < nodes[i].children.length ; j++) {
            if(selectedFiles.includes(nodes[i].children[j])) {
                c++;
            }
            if(nodes[i].children[j].partialSelected){
                nodes[i].partialSelected = true;
                nodes[i].expanded = true;
            } 
        }
        if(c == 0) {}
        else if(c == count) { 
            nodes[i].partialSelected = true;
            if(!selectedFiles.includes(nodes[i])){
                selectedFiles.push(nodes[i]); 
            }
        }
        else {
            nodes[i].partialSelected = true;
        }
        resultado=selectedFiles;
        return resultado 
    }
   
}

export function listarPerfilesIndex(node:any):any{
    let array = Array.isArray(node) ? node : [node]
    let contador=1
    array= array.reduce((acc,el)=>{
        el.tipousuario=contador++
        el.Perfil= el.Perfil.trim()
        acc.push(el)
        return acc
    },[])

    return array
}

export function nodoRecursivoNuevo(node:any):any{
    const array = Array.isArray(node) ? node : [node]

    return array.reduce((acc,el)=>{
        el.partialSelected = false;
        el.expanded = false;
        if(el.children){
            nodoRecursivoNuevo(el.children)
        }
        return array
    },[])

}

export function nodoRecursivoEdit(node:any,selected:string[]):any{
    const array = Array.isArray(node) ? node : [node]

    return array.reduce((acc,el)=>{
        
        if(el.children){
            if(selected.includes(el.data)){
                el.partialSelected = true
            }
            nodoRecursivoEdit(el.children,selected)
        }
        return array
    },[])

}
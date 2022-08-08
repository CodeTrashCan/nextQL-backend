import { BlogPostDataBasicInfo } from "@/utils/Types"
import { getPostName } from "./github"

/**
 * 깃허브의 파일들의 이름을 가지고 와서 문자열노드를 변환해줍니다.
 * 
 * @param fileName 깃허브 블로그 포스트 저장이름
 * @param filePath 깃허브 블로그 포스트 디렉토리
 * @returns query 일부의 형식으로 node가 반환됩니다.
 */
export function returnNode(fileName:string,filePath:string):string{
    return `${fileName} : history(path: "${filePath}") {
        edges {
          node { 
            committedDate 
            oid
            author
            {  
              email
            }
          } 
        }
      }
      `
}
/**
 * graphql에 사용할 커밋 `query`를 반환합니다.
 * 
 * @param nodes 커밋 날짜를 불러오는 노드 배열입니다.
 * @returns 커밋 날짜를 집어넣고 문자열로 반환값입니다.
 */
export function returnGetBlogCommitQuery(nodes:string[]):string{
    let commits = ''
    for(const node of nodes){
        commits+=node
    }
    const query = `query RepoFiles($own:String!,$repo:String!){
        repository(owner: $own, name: $repo) {
          commitsData:object(expression: "main") {
            ... on Commit {
              ${commits}
          }
        }
      }
    }
    `

    return query
}
/**
 * 블로그의 모든 포스트 글을 방아옵니다.
 * 
 * @returns 기존의 literal를 반환합니다.
 */
export function returnGetBlogContentQuery(){
    const query = 
    `query RepoFiles($own:String!,$repo:String!){
        repository(owner: $own, name: $repo) {
            content: object(expression: "HEAD:") {
                ... on Tree {
                        entries {
                            name
                            type
                            object {
                            ... on Blob {
                                byteSize
                            }
                            ... on Tree {
                                entries {
                                    name
                                    type
                                        object {
                                            ... on Blob {
                                                byteSize
                                                text
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
          
            }
        }
    }
    `
    return query
}

/**
 * 위애 있는 literal를 사용하여 `title`과 `path`를 불러오는 query를 받아옵니다.
 * 
 * @param content query를 사용하기 위한 기본 정보를 넣는 매개변수입니다.
 * @returns 
 */
export async function getQuery(content:BlogPostDataBasicInfo){
    const fileDate = await getPostName({owner:content.owner,repo:content.repo,path:content.path})

    /** 커밋 기록을 가지고 오는 형식을 만들어주는 틀입니다. */
    const nodes:string[] = []
    fileDate.forEach(value => {
        const temp = returnNode(value.name.replace(".md",""),value.path)

        nodes.push(temp)
    })
    
    /** 글을 가지고 올 때 사용하는 query입니다. */
    const query = returnGetBlogCommitQuery(nodes)
    return query
}

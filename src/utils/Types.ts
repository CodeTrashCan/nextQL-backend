export interface GithubContirbutions{
    startingDate:Date
}


/** 각 커밋에 사용되는 노드를 정의하는 형식입니다. */
export interface Node{
    node:{
        committedDate:string 
        oid:string
        author:{  
          email:string
        }
    }
}

/** 각 블로그 포스팅 내용이 들어가 있는 형식입니다. */
export interface ContentNode{
    name:string,
    object:{
        entries:[]
    }
    type:string
}

/** 사용하는 커밋 데이터의 파일의 기본 정보를 넣는 파일 형식입니다. */
export interface ContentFile{
    name:string,
    object:{
        byteSize: number;
        text:string
    },
    type:string
}
/** 커밋 내용 데이터를 정의하는 부분입니다. */
export interface CommitDatas{
    edges: Node[]
}

/** 커밋 관련된 리퀘스트를 보낸후에 사용하는 반환합니다. */
export interface CommitResponse{
    data:{
        repository:{
            commitsData:Record<string, never>,

        }
    }
}

/**
 * 깃허브 블로그 글을 작성할때의 기본적인 정보를 입력하는 데이터 타입입니다.
 */
export interface BlogPostData{
    startingDate:string,
    name:string,
    content:string ,
    createdat:string,
    updatedat:string,
    titleData:TitleData,
}

/**
 *  깃허브에서 글을 가지고 와서 특정 `prefix` ,`surfix`를 지정해서 `title`과 `tags` 받아옵니다.
 */
 export interface TitleData{
    title:string,
    tags:string[],
}


/**
 * 블로그 포스트를 각종 정보를 api에서 받아오기 위해 사용하는 기본 데이터 양식입니다.
 */
 export interface BlogPostDataBasicInfo{
    /** 현재 받아올 깃허브의 아이디입니다. */
    owner:string,
    /** 현재 사용할 레파지토리 이름입니다. */
    repo:string
    /** 현재 사용하고 있는 폴더 이름입니다. */
    path:string,
}

/**
 * 깃버브에서 폴더 정도를 가지고 올 때 사용하는 형식 파일입니다.
 */
 export interface FolderResponse {
    type: string;
    size: number;
    name: string;
    path: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    download_url: string;
}

/**
 * 포스트 재목에 사용하는 형식입니다.
 */
 export interface PostTile{
    name: string,
    path: string
}

/**
 * 깃허브에서 파일 `content`를 가지고 올 때 사용하는 형식 파일입니다.
 */
 export interface FileContentsResponse {
    type: string;
    encoding: string;
    size: number;
    name: string;
    path: string;
    content: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    download_url: string;
  }
  
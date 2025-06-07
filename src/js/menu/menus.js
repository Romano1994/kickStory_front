const menus = [
    // HomePage가 menu에 있으면 HomePage가 있고, 그 안의 route로 HomePage를 한 번 더 인식하게 됨
    // 여기에 있는 컴포넌트들은 HomePage에 있는 Rotuer-View에 들어갈 컴포넌트들만 정의해주면 된다.
    // https://v3.router.vuejs.org/kr/guide/essentials/nested-routes.html 참고
    // {
    //     path: "/",
    //     name: "homePage",
    //     componentPath: "HomePage",
    // }
    {
        path: "sample",//URL 경로
        name: "ReactiveSample",//컴포넌트명
        componentPath:"ReactiveSample",//실제 컴포넌트 경로
        depth:0
    },
    {
        path: "/",
        name: "KicksHistory",//컴포넌트명
        componentPath:"KicksHistory",//실제 컴포넌트 경로
        depth:1
    },
    {
        path: "/kp",
        name: "KicksProfile",//컴포넌트명
        componentPath:"KicksProfile",//실제 컴포넌트 경로
        depth:1
    },
    {
        path: "/kc",
        name: "KicksCommunity",//컴포넌트명
        componentPath:"KicksCommunity",//실제 컴포넌트 경로
        depth:1
    },
    {
        path: "/kc/:id",
        name: "KicksCommunityDetail",//컴포넌트명
        componentPath:"KicksCommunityDetail",//실제 컴포넌트 경로
        depth:0
    },
    {
        path: "/km",
        name: "KicksMap",//컴포넌트명
        componentPath:"KicksMap",//실제 컴포넌트 경로
        depth:1
    },
    {
        path: "/login",
        name: "LogIn",
        componentPath:"LogIn",
        depth:0
    },
    {
        path: "/join",
        name: "MemberJoin",
        componentPath:"MemberJoin",
        depth:0
    },    
  ];
  
  export default menus;
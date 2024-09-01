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
        componentPath:"ReactiveSample"//실제 컴포넌트 경로
    }
  ];
  
  export default menus;
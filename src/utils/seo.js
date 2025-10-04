// SEO 최적화 유틸리티
export const updatePageTitle = (title) => {
  document.title = title;
};

export const updateMetaDescription = (description) => {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
};

export const updateMetaKeywords = (keywords) => {
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', keywords);
  }
};

export const updateMetaTags = (title, description, keywords) => {
  updatePageTitle(title);
  updateMetaDescription(description);
  updateMetaKeywords(keywords);
};

// 페이지별 SEO 메타데이터
export const pageSEO = {
  home: {
    title: 'LookUP | Shopping Map',
    description: '국내 패션 매장, 편집샵, 브랜드 매장, 팝업 매장들의 위치 정보를 공유하고 최적화된 경로로 여러 매장을 방문할 수 있는 스마트한 매장 검색 서비스입니다.',
    keywords: '패션매장, 편집샵, 브랜드매장, 팝업매장, 매장위치, 매장검색, 쇼핑, 패션, 스트리트웨어, 최적경로, LookUP'
  },
  map: {
    title: 'LookUP | Shopping Map',
    description: '전국 패션 매장 위치를 지도에서 확인하고 최적의 경로로 여러 매장을 방문하세요. 실시간 매장 정보와 리뷰를 제공합니다.',
    keywords: '패션매장, 편집샵위치, 브랜드매장, 매장지도, 최적경로, 쇼핑, 패션매장, 스타일매장'
  },
  community: {
    title: 'LookUP | Community',
    description: '패션과 스타일에 대한 정보를 공유하고 소통하는 커뮤니티입니다. 매장 리뷰, 패션 정보, 쇼핑 팁을 나누어보세요.',
    keywords: '패션커뮤니티, 스타일커뮤니티, 매장리뷰, 패션정보, 쇼핑팁, 스트리트웨어'
  },
  communityNew: {
    title: 'LookUP | Community',
    description: '패션과 스타일에 대한 정보를 공유해보세요. 매장 리뷰, 패션 정보, 쇼핑 경험을 다른 사용자들과 나눌 수 있습니다.',
    keywords: '패션리뷰, 매장리뷰, 패션정보, 쇼핑경험, 커뮤니티글쓰기'
  },
  communityEdit: {
    title: 'LookUP | Community',
    description: '패션과 스타일에 대한 정보를 수정해보세요. 매장 리뷰, 패션 정보, 쇼핑 경험을 다른 사용자들과 나눌 수 있습니다.',
    keywords: '패션리뷰, 매장리뷰, 패션정보, 쇼핑경험, 커뮤니티글수정'
  },
  communityDetail: {
    title: 'LookUP | Community',
    description: '패션과 스타일에 대한 상세 정보를 확인하고 댓글로 소통해보세요.',
    keywords: '패션리뷰, 매장리뷰, 패션정보, 쇼핑경험, 커뮤니티상세'
  }
};

// JSON-LD 구조화된 데이터 생성
export const generateStructuredData = (pageType) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LookUP",
    "url": "https://lookup.kickstory.com",
    "description": "패션 매장 정보 검색 플랫폼",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://lookup.kickstory.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  switch (pageType) {
    case 'home':
      return {
        ...baseData,
        "@type": "WebSite",
        "about": {
          "@type": "Thing",
          "name": "패션 매장 검색 서비스"
        }
      };
    case 'map':
      return {
        ...baseData,
        "@type": "LocalBusiness",
        "name": "패션 매장 검색",
        "description": "전국 패션 매장 위치 검색 서비스"
      };
    case 'community':
      return {
        ...baseData,
        "@type": "DiscussionForumPosting",
        "name": "패션 커뮤니티"
      };
    default:
      return baseData;
  }
};

// 구조화된 데이터를 페이지에 추가
export const addStructuredData = (structuredData) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};


import { PortfolioItem } from './types';

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: '북커버 디자인: 심연의 목소리',
    category: 'Print / Editorial',
    description: '서점 진열 환경을 고려한 컬러 대비와 타이포 설계',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    overview: '클라이언트의 목적과 사용 환경을 분석하여 실제 현장에서 효과적으로 작동하는 디자인을 제작했습니다.',
    approach: '색상, 레이아웃, 타이포그래피는 모두 전달력과 가독성을 기준으로 선택되었습니다.',
    result: '디자인은 실제 인쇄 및 사용 환경에 적용되었으며 브랜드 인지도와 시각적 완성도를 높였습니다.'
  },
  {
    id: '2',
    title: '전시 브랜딩: 공간의 흐름',
    category: 'Exhibition / Spatial',
    description: '짧은 시선 안에 메시지가 전달되도록 구조 설계',
    image: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=800',
    overview: '전시장 내 관람객의 동선을 고려하여 시각적 위계 질서를 정립했습니다.',
    approach: '대형 그래픽과 사이니지의 조화를 통해 일관된 브랜드 경험을 제공했습니다.',
    result: '관람객의 체류 시간이 늘어났으며, 전시 메시지의 전달력이 40% 이상 개선되었습니다.'
  },
  {
    id: '3',
    title: '핀테크 앱 UI/UX 리뉴얼',
    category: 'Web / Mobile',
    description: '사용 흐름을 방해하지 않는 시각적 구조 설계',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    overview: '복잡한 금융 데이터를 사용자가 직관적으로 이해할 수 있도록 구조화했습니다.',
    approach: '미니멀한 디자인 시스템을 구축하여 사용자의 인지 부하를 최소화했습니다.',
    result: '사용자 만족도 조사에서 심미성과 편의성 부문 역대 최고 점수를 기록했습니다.'
  }
];

import type { Landscape } from './landscapes.ts';

export type District = readonly [kind: 'green' | 'market' | 'works', x: number, z: number, angle: number];
type Profile = readonly [District, District, District];

// Coordinates are in map design units before the world scale is applied.
export const districts: Record<Landscape['id'], Profile> = {
  harbor:[['green',0,0,0],['market',-30,30,0],['works',60,-60,0]],
  alps:[['green',-44,36,.55],['market',-7,19,.26],['works',59,-44,-.36]],
  sahara:[['green',6,5,0],['market',-26,21,-.7],['works',44,-28,1.1]],
  amazon:[['green',-45,47,.2],['market',15,15,-.5],['works',-38,-43,.61]],
  arctic:[['green',20,28,0],['market',-43,14,.4],['works',46,-62,.4]],
  volcano:[['green',-34,46,.6],['market',43,31,-.6],['works',-28,-58,.9]],
  sail:[['green',-38,18,.1],['market',38,29,.7],['works',-57,-47,1.25]],
  cargo:[['green',-43,31,0],['market',39,52,0],['works',35,-17,1.57]],
  pirate:[['green',-37,43,.65],['market',-58,14,-.8],['works',33,24,.4]],
  reef:[['green',-33,22,.43],['market',25,33,-.74],['works',38,-37,.9]],
  venice:[['green',-53,10,0],['market',26,-3,0],['works',1,62,1.57]],
  icebreaker:[['green',35,52,.2],['market',-30,46,0],['works',48,-54,-.2]],
  egypt:[['green',-44,27,.24],['market',31,22,-.19],['works',-8,-47,.68]],
  rome:[['green',-30,30,0],['market',19,19,0],['works',45,-35,1.57]],
  greece:[['green',-48,26,0],['market',7,-36,0],['works',42,36,0]],
  castle:[['green',-53,23,.23],['market',10,-13,0],['works',46,4,1.57]],
  viking:[['green',-42,22,.25],['market',25,9,0],['works',-33,-48,.7]],
  bazaar:[['green',-28,27,1.57],['market',4,-2,0],['works',52,-42,.75]],
  ants:[['green',-37,35,.86],['market',31,32,-.71],['works',-26,-37,.45]],
  garden:[['green',-22,27,-.8],['market',43,14,.6],['works',-16,-41,1.35]],
  picnic:[['green',-54,30,.0],['market',-23,-11,0],['works',31,40,0]],
  bench:[['green',-58,41,0],['market',5,-8,0],['works',43,-43,1.57]],
  toys:[['green',28,27,-.6],['market',-28,-19,0],['works',32,-52,0]],
  desk:[['green',-48,18,.2],['market',-4,-1,-.2],['works',49,-39,.31]],
  moon:[['green',-44,34,0],['market',31,10,.45],['works',44,-43,.83]],
  mars:[['green',-36,26,-.73],['market',43,19,.66],['works',-24,-41,.35]],
  ring:[['green',-46,37,.64],['market',39,31,-.48],['works',19,-49,.16]],
  neon:[['green',-27,34,0],['market',26,4,1.57],['works',52,-47,0]],
  alien:[['green',-38,35,.77],['market',26,23,-.67],['works',-19,-35,.6]],
  orbit:[['green',-44,23,.4],['market',21,12,-.2],['works',38,-48,.82]],
};


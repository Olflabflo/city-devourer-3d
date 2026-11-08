export type Shape = 'box' | 'pole' | 'crown' | 'wheel' | 'cone' | 'pyramid' | 'gem' | 'ring' | 'sphere' | 'hull' | 'ship';
export type Piece = {
  shape: Shape; color: number; x: number; y: number; z: number;
  w: number; h: number; d: number; yaw: number; pitch: number; roll: number;
  motion?: { kind: 'swing' | 'spin'; phase: number };
};
export function piece(color: number, x: number, y: number, z: number, w: number, h: number, d: number,
  shape: Shape = 'box', yaw = 0, pitch = 0, roll = 0): Piece {
  return { color, x, y, z, w, h, d, shape, yaw, pitch, roll };
}

const bark = 0x75513d;
const metal = 0x3f4a58;
const ivory = 0xf4e3c1;
const foliage = 0x437d4d;
const glass = 0x82c1df;
const white = 0xf3f1e3;
function animated(part: Piece, kind: 'swing' | 'spin', phase = 0): Piece {
  return { ...part, motion: { kind, phase } };
}

export function model(name: string, a: number, b: number): Piece[] {
  const p = piece;
  const form = (shape: Shape, w: number, h: number, d: number, color = a) => p(color, 0, h / 2, 0, w, h, d, shape);
  const mast = (x: number, h: number, sailColor: number) => [
    p(bark, x, h / 2, 0, .07, h, .07, 'pole'),
    p(sailColor, x + .25, h * .69, 0, .47, h * .56, .065, 'pyramid', 0, 0, -.16),
  ];
  const teeth = (height: number, span: number) => [-1, 1].flatMap(x => [-1, 1].map(z =>
    p(ivory, x * span, height, z * span, .24, .3, .24)));
  const arcade = (radius: number, count: number, height: number) => Array.from({length:count}, (_, i) => {
    const t = i * Math.PI * 2 / count;
    return p(ivory, Math.cos(t) * radius, height / 2, Math.sin(t) * radius, .12, height, .12, 'pole');
  });
  switch (name) {
    case 'hydrant': return [form('pole', .48, .58, .48, a), p(a, 0, .61, 0, .55, .2, .55, 'sphere'),
      ...[-1,1].map(side => p(ivory, 0, .39, side * .26, .2, .13, .2, 'wheel'))];
    case 'bike': return [
      ...[-.5,.5].flatMap(x => [p(metal, x, .29, 0, .55, .55, .085, 'wheel'),
        p(ivory, x, .29, 0, .42, .42, .092, 'wheel')]),
      p(a, 0, .36, 0, 1.01, .078, .078, 'box', 0, 0, .15),
      p(a, -.06, .51, 0, .63, .077, .077, 'box', 0, 0, -.49),
      p(metal, -.26, .67, 0, .23, .067, .17), p(metal, .45, .66, 0, .077, .39, .077, 'box', 0, 0, .2),
      p(metal, .46, .84, 0, .075, .065, .34),
    ];
    case 'stop': return [
      p(metal, -.51, .62, -.25, .08, 1.24, .08), p(metal, .51, .62, -.25, .08, 1.24, .08),
      p(glass, 0, .74, -.25, 1.01, .77, .065), p(a, 0, 1.24, -.03, 1.23, .12, .69),
      p(b, 0, .34, -.04, .89, .13, .35),
    ];
    case 'bollard': return [form('pole', .48, .14, .48, metal), p(metal, 0, .39, 0, .26, .65, .26, 'pole'),
      p(a, 0, .72, 0, .34, .13, .34, 'pole')];
    case 'rope': return [.08,.16,.24].map((y,i) => p(0xb9996d, 0, y, 0, .78 - i * .13, .11, .78 - i * .13, 'ring'));
    case 'lily': return [p(foliage, 0, .1, 0, .78, .09, .65, 'pole'), p(a, -.05, .17, .02, .2, .14, .19, 'crown')];
    case 'urn': return [form('sphere', .67, .74, .67, 0xbe7952), p(b, 0, .73, 0, .32, .12, .32, 'ring'),
      ...[-1,1].map(side => p(0xbe7952, 0, .52, side * .31, .27, .08, .23, 'ring', 0, 0, Math.PI / 2))];
    case 'sack': return [form('sphere', .75, .7, .61, 0xbda47a), p(bark, 0, .71, 0, .25, .13, .21, 'sphere')];
    case 'planter': return [form('pole', .76, .43, .76, 0xb9795e), p(foliage, 0, .51, 0, .73, .38, .69, 'crown'),
      p(a, .17, .74, .05, .24, .17, .21, 'sphere')];
    case 'awning': return [
      form('box', 1.34, .69, 1.04, b), p(ivory, 0, .85, 0, 1.43, .38, 1.12, 'hull', Math.PI / 2),
      p(glass, -.28, .42, .53, .35, .31, .055),
      ...[-1,0,1].map(i => p(i ? a : ivory, i * .36, .68, .64, .35, .12, .39, 'box', 0, .18)),
    ];
    case 'battery': return [form('box', .86, .52, .63, metal), p(a, 0, .32, .32, .58, .2, .035),
      ...[-1,1].map(side => p(ivory, side * .22, .57, 0, .18, .13, .18, 'pole'))];
    case 'supply': return [form('box', 1.42, .81, .87, b), ...[-1,1].map(side => p(a, side * .44, .41, 0, .13, .85, .92)),
      p(ivory, 0, .52, .45, .26, .19, .025)];
    case 'signal': return [form('box', .38, .14, .38, metal), p(metal, 0, .44, 0, .09, .78, .09, 'pole'),
      p(a, 0, .89, 0, .31, .18, .31, 'gem')];
    case 'handcart': case 'carriage': {
      const carriage = name === 'carriage';
      return [
        p(bark, -.29, .5, 0, .91, .21, .73), p(b, -.29, .65, 0, .85, .23, .59),
        ...[-1,1].flatMap(side => [
          p(metal, -.35, .28, side * .4, .53, .53, .1, 'wheel'),
          p(bark, .34, .52, side * .24, 1.17, .055, .06),
        ]),
        ...(carriage ? [
          p(0xa77c54, .71, .59, 0, .73, .35, .31, 'sphere'),
          p(0xa77c54, .97, .84, 0, .3, .43, .24, 'sphere', 0, 0, -.37),
          p(0xb88f68, 1.12, .91, 0, .29, .22, .22, 'sphere'),
          ...[-1,1].flatMap(side => [-1,1].map(front => animated(
            p(0x795840, .73 + front * .24, .29, side * .1, .092, .54, .1), 'swing', side * front))),
        ] : [
          p(b, .7, .72, 0, .28, .34, .34, 'sphere'), p(0xe0ae86, .76, .99, 0, .24, .27, .25, 'sphere'),
          ...[-1,1].map(side => animated(p(metal, .74, .31, side * .1, .12, .52, .12), 'swing', side)),
        ]),
      ];
    }
    case 'fish': return [
      p(a, .07, .36, 0, 1.15, .35, .53, 'sphere'),
      p(b, -.59, .37, 0, .41, .31, .12, 'pyramid', 0, 0, Math.PI / 2),
      p(ivory, .43, .46, .14, .13, .13, .13, 'sphere'),
      p(metal, .47, .47, .19, .062, .062, .062, 'sphere'),
    ];
    case 'cart': return [
      p(bark, 0, .55, 0, 1.38, .43, .83),
      ...[-.49,.49].flatMap(x => [-.43,.43].map(z => p(metal, x, .3, z, .49, .49, .16, 'wheel'))),
      p(b, -.18, .84, 0, .58, .42, .67), p(a, .29, .8, .04, .33, .31, .45),
      p(bark, .91, .44, 0, .55, .08, .09),
    ];
    case 'walker': case 'woman': case 'roman': case 'roman-woman': case 'robot': {
      const woman = name === 'woman' || name === 'roman-woman';
      const ancient = name.startsWith('roman');
      const robot = name === 'robot';
      const skin = robot ? 0xaad4dd : woman ? 0xb77d57 : 0xe6ae85;
      const hair = robot ? metal : woman ? 0x58322d : 0x473c36;
      const garment = ancient ? (woman ? 0x619c94 : 0xc05245) : a;
      return [
        p(garment, 0, .66, 0, .35, .39, .43, 'sphere'),
        p(ancient ? ivory : b, 0, .5, 0, .32, .08, .4),
        p(skin, .045, .96, 0, .26, .29, .26, robot ? 'box' : 'sphere'),
        p(hair, -.015, 1.06, 0, .29, .12, .28, robot ? 'box' : 'sphere'),
        ...(woman ? [p(hair, -.18, .91, 0, .19, .31, .25, 'sphere')] : []),
        ...[-1, 1].flatMap(side => [
          p(robot ? 0x57f5f5 : metal, .166, .98, side * .055, .026, .028, .03, 'sphere'),
          animated(p(ancient ? skin : metal, 0, .27, side * .12, .16, .44, .145), 'swing', side),
          animated(p(hair, .052, .105, side * .12, .235, .125, .15, 'sphere'), 'swing', side),
          animated(p(skin, .01, .59, side * .245, .125, .33, .12, 'sphere'), 'swing', -side),
        ]),
        ...(ancient && !woman ? [
          p(ivory, .03, 1.06, 0, .31, .15, .29, 'sphere'),
          p(0xb64443, -.025, 1.17, 0, .24, .13, .075, 'sphere'),
          p(0xab5341, .01, .54, -.32, .28, .47, .105, 'sphere'),
          p(0xf1c873, .078, .55, -.373, .08, .09, .035, 'sphere'),
        ] : []),
        ...(robot ? [p(0x57f5f5, .17, .67, 0, .08, .16, .22), p(metal, -.05, 1.22, 0, .048, .24, .05, 'pole')] : []),
      ];
    }
    case 'stone': return [form('crown', 1.05, .74, .81, b), p(a, .26, .31, .16, .28, .22, .26, 'crown')];
    case 'seed': return [p(a, 0, .26, 0, .48, .3, .85, 'sphere'), p(ivory, 0, .42, 0, .045, .04, .58)];
    case 'crate': return [form('box', 1.3, .83, .92), p(bark, 0, .45, 0, 1.34, .13, .97), p(ivory, 0, .86, 0, .62, .06, .62)];
    case 'barrel': return [form('pole', .9, 1, .9, bark), ...[.2, .78].map(y => p(metal, 0, y, 0, .95, .09, .95, 'pole')), p(a, 0, 1.01, 0, .82, .05, .82, 'pole')];
    case 'jar': return [form('sphere', .85, .95, .85), p(b, 0, .96, 0, .44, .25, .44, 'pole'), p(metal, 0, 1.09, 0, .22, .025, .22, 'pole')];
    case 'chest': case 'toolbox': return [form('box', 1.55, .6, .83, name === 'chest' ? bark : a),
      p(a, 0, .62, 0, 1.54, .28, .83, 'sphere'), p(ivory, 0, .52, .43, .18, .2, .06)];
    case 'buoy': return [form('pole', .9, .33, .9), p(ivory, 0, .52, 0, .23, .61, .23, 'pole'), p(a, 0, .88, 0, .5, .34, .5, 'cone')];
    case 'ice': case 'iceberg': return [
      form('gem', 1.58, name === 'ice' ? .77 : 1.38, 1.14, 0xbce7ed),
      p(white, .21, .74, .06, .65, .63, .47, 'gem', .4),
    ];
    case 'fir': return [form('pole', .16, .68, .16, bark), ...[.64, 1.02, 1.37].map((y, i) => p(i === 2 ? a : foliage, 0, y, 0, 1.04 - i * .24, .87, 1.04 - i * .24, 'cone'))];
    case 'palm': return [
      form('pole', .19, 1.35, .19, bark),
      ...Array.from({length:6}, (_,i) => {
        const t = i * Math.PI / 3;
        return p(i % 2 ? foliage : 0x79a454, Math.sin(t) * .38, 1.37, Math.cos(t) * .38, .28, .11, .99, 'sphere', t, .27);
      }),
    ];
    case 'banyan': return [
      form('pole', .38, 1.35, .38, bark),
      ...[-1, 0, 1].map(i => p(i ? foliage : b, i * .48, 1.44 + (1 - Math.abs(i)) * .4, i * .23, 1.12, .86, 1.09, 'crown')),
      ...[-1, 1].map(i => p(bark, i * .49, .56, i * .18, .11, 1.12, .11, 'pole')),
    ];
    case 'leaf': return [
      p(foliage, 0, .22, 0, 1, .21, 1.85, 'sphere', .3), p(a, 0, .33, 0, .055, .055, 1.7, 'box', .3),
    ];
    case 'root': return [-1, 0, 1].map(i => p(bark, i * .29, .23, 0, .28, .45, 1.61, 'sphere', i * .36));
    case 'peak': case 'ridge': case 'dune': {
      const snow = name === 'peak';
      const height = name === 'dune' ? .7 : name === 'ridge' ? 1.35 : 2.2;
      return [p(b, 0, height * .43, 0, 1.89, height, 1.24, 'cone', .27),
        p(snow ? white : a, -.21, height * .73, 0, 1.19, height * .66, .84, 'cone', .27),
        p(b, .47, height * .33, .18, .86, height * .63, .83, 'cone')];
    }
    case 'volcano': case 'nest': {
      const nest = name === 'nest';
      return [p(b, 0, .42, 0, 1.92, .84, 1.69, 'sphere'),
        p(nest ? a : 0xcc513d, 0, .85, 0, 1.05, .26, 1.05, 'ring'),
        p(0x271f27, 0, .84, 0, .55, .16, .55, 'pole'),
        ...(nest ? [p(bark, .31, .21, .63, .24, .32, .22, 'sphere')] : [p(0xff9d44, .28, .43, .48, .15, .1, .64, 'sphere', .34, -.62)])];
    }
    case 'cabin': case 'longhouse': case 'stilt': {
      const long = name === 'longhouse';
      const stilts = name === 'stilt';
      const y = stilts ? .57 : 0;
      const w = long ? 1.7 : 1.19;
      return [p(b, 0, y + .36, 0, w, .72, .96),
        p(a, 0, y + .82, 0, w + .12, .54, 1.11, 'hull', Math.PI / 2),
        p(bark, 0, y + .21, .49, .24, .42, .07),
        p(glass, .34, y + .46, .49, .23, .24, .06),
        ...(stilts ? [-1, 1].flatMap(x => [-1, 1].map(z => p(bark, x * .48, .29, z * .39, .11, .58, .11))) : [])];
    }
    case 'sail': case 'galleon': case 'longboat': case 'wreck': {
      const big = name === 'galleon' || name === 'wreck';
      const long = name === 'longboat';
      const broken = name === 'wreck';
      const color = big ? (broken ? b : a) : long ? a : ivory;
      return [
        p(bark, 0, .24, 0, 1.93, .48, big ? .86 : .67, 'ship'),
        p(ivory, 0, .47, 0, 1.76, .085, big ? .73 : .57, 'ship'),
        ...[-1, 1].map(side => p(bark, -.09, .57, side * (big ? .34 : .27), 1.35, .085, .055)),
        ...mast(big ? -.39 : .03, big ? 1.54 : 1.21, color),
        ...(big ? mast(.42, broken ? .66 : 1.27, color) : []),
        ...(long ? [-1, 1].flatMap(z => [-.58, -.26, .12, .47].map(x => p(a, x, .49, z * .33, .2, .2, .105, 'sphere'))) : []),
        ...(big ? [-1, 1].flatMap(z => [-.58, -.19, .2, .59].map(x => p(metal, x, .31, z * .39, .12, .11, .09))) : []),
      ];
    }
    case 'cargo': case 'breaker': {
      const ice = name === 'breaker';
      return [p(0xa94c49, 0, .12, 0, 1.91, .24, .82, 'ship'),
        p(a, 0, .32, 0, 1.94, .23, .88, 'ship'),
        p(metal, 0, .435, 0, 1.84, .075, .79, 'ship'),
        p(white, -.57, .67, 0, .44, .51, .57), p(glass, -.56, .85, 0, .49, .14, .59),
        p(metal, -.64, 1.04, 0, .13, .26, .15, 'pole'),
        animated(p(white, -.64, 1.18, 0, .3, .05, .06), 'spin'),
        ...[-1,1].flatMap(side => [
          p(ivory, -.10, .51, side * .39, 1.48, .032, .027),
          ...[-.72,-.24,.23,.64].map(x => p(ivory, x, .471, side * .39, .031, .10, .031)),
          ...[-.66,-.49].map(x => p(metal, x, .851, side * .30, .029, .14, .018)),
          p(side > 0 ? 0x7cdd9b : 0xff7674, -.4, .93, side * .32, .045, .045, .045, 'sphere'),
        ]),
        ...(ice ? [p(white, .46, .55, 0, .83, .16, .49, 'hull')] :
          [-.15, .22, .58].flatMap((x,i) => [-.16,.16].map(z => p(i % 2 ? a : b, x, .63, z, .35, .37, .28)))),
      ];
    }
    case 'crane': return [
      form('box', 1.4, .19, .83, metal), p(a, -.43, .73, 0, .19, 1.46, .22),
      p(a, .12, 1.46, 0, 1.38, .14, .14), p(metal, .69, 1.15, 0, .035, .59, .035),
      p(b, .69, .86, 0, .3, .18, .27),
    ];
    case 'coral': return [form('crown', 1.2, .43, .94, b), ...[-2,-1,0,1,2].map(i =>
      p(i % 2 ? b : a, i * .16, .55 + .16 * (2 - Math.abs(i)), i % 2 * .2, .24, .77, .24, 'cone', 0, 0, -i * .26))];
    case 'shell': case 'shield': return [p(a, 0, .27, 0, .86, .24, .81, 'sphere', 0, .31),
      p(ivory, 0, .4, 0, .23, .16, .23, 'sphere')];
    case 'arch': return [
      ...[-1,1].map(i => p(b, i * .59, .49, 0, .37, .98, .57)),
      ...Array.from({length:7}, (_,i) => {
        const t = (i + .5) * Math.PI / 7;
        return p(i % 2 ? b : ivory, Math.cos(t) * .59, .89 + Math.sin(t) * .59, 0, .28, .35, .58, 'box', 0, 0, t - Math.PI / 2);
      }),
    ];
    case 'pyramid': return [p(b, 0, .64, 0, 1.76, 1.28, 1.76, 'pyramid'), p(a, 0, .1, .65, .2, .23, .32)];
    case 'column': case 'obelisk': return [
      form('box', .63, .13, .63, b),
      p(ivory, 0, .7, 0, .36, 1.28, .36, name === 'column' ? 'pole' : 'box'),
      p(a, 0, 1.43, 0, .45, .25, .45, name === 'column' ? 'box' : 'pyramid'),
    ];
    case 'temple': return [
      form('box', 1.74, .18, 1.39, b),
      ...[-.61,-.2,.2,.61].flatMap(x => [-.48,.48].map(z => p(ivory, x, .59, z, .15, .89, .15, 'pole'))),
      p(a, 0, 1.04, 0, 1.6, .18, 1.17), p(ivory, 0, 1.25, 0, 1.71, .36, 1.26, 'hull', Math.PI / 2),
    ];
    case 'arena': return [
      form('pole', 1.89, .19, 1.35, b), ...arcade(.75, 14, .72),
      p(a, 0, .73, 0, 1.72, .22, 1.72, 'ring'),
      ...arcade(.64, 14, 1.12).filter((_, i) => i < 9),
    ];
    case 'statue': return [
      form('box', .76, .25, .76, b), p(ivory, 0, .74, 0, .54, .93, .48, 'cone'),
      p(ivory, 0, 1.22, 0, .31, .46, .22), p(ivory, 0, 1.53, 0, .3, .37, .31, 'sphere'),
      p(ivory, .27, 1.29, 0, .55, .15, .18, 'box', 0, 0, .42),
    ];
    case 'tower': case 'keep': return [
      form('box', name === 'keep' ? 1.5 : .95, 1.49, name === 'keep' ? 1.27 : .95, b),
      p(a, 0, 1.49, 0, 1.42, .18, 1.26), ...teeth(1.69, .49),
      p(metal, 0, .37, .67, .26, .49, .075),
      ...(name === 'keep' ? [p(a, 0, 1.81, 0, .89, .84, .89, 'cone'), p(a, -.6, .97, .22, .52, 1.95, .54, 'pole')] : []),
    ];
    case 'palazzo': return [
      form('box', 1.65, 1.35, 1.05, b), p(a, 0, 1.4, 0, 1.73, .24, 1.13, 'hull', Math.PI / 2),
      ...[-.53,-.18,.18,.53].flatMap(x => [.43,.94].map(y => p(glass, x, y, .53, .17, .27, .045))),
    ];
    case 'stall': case 'caravan': return [
      form('box', 1.38, .47, 1.0, b),
      ...[-.57,.57].flatMap(x => [-.39,.39].map(z => p(bark, x, .63, z, .065, 1.26, .065))),
      ...[-2,-1,0,1,2].map((x,i) => p(i % 2 ? ivory : a, x * .29, 1.25, 0, .29, .13, 1.11, 'box', 0, -.16)),
      ...(name === 'caravan' ? [p(a, 0, 1.62, 0, .82, .66, .82, 'sphere'), ...teeth(.81, .63)] : []),
    ];
    case 'cloth': case 'paper': case 'panel': return [
      form('box', 1.48, .18, 1.06, name === 'paper' ? ivory : a),
      p(b, .1, .18, -.07, 1.27, .1, .9, 'box', .22),
    ];
    case 'ant': case 'beetle': {
      const ant = name === 'ant';
      return [
        ...[-.55, -.03, .46].map((x,i) => p(i === 0 ? a : b, x, .39, 0, i === 0 ? .75 : .52, .43, ant ? .39 : .71, 'sphere')),
        ...[-1,1].flatMap(z => [-.39,0,.32].map((x,i) => p(metal, x, .2, z * .34, .075, .075, .59, 'box', z * (i - 1) * .52, z * -.31))),
        ...[-1,1].map(z => p(metal, .67, .51, z * .14, .36, .054, .055, 'box', z * -.43, 0, .29)),
      ];
    }
    case 'drop': return [form('gem', .65, .87, .65, glass), p(white, -.14, .57, .18, .12, .19, .09, 'sphere')];
    case 'flower': return [
      form('pole', .12, 1.1, .12, foliage), p(a, 0, 1.13, 0, .46, .27, .46, 'sphere'),
      ...Array.from({length:8}, (_,i) => {
        const t = i * Math.PI / 4;
        return p(b, Math.sin(t) * .47, 1.1, Math.cos(t) * .47, .34, .23, .75, 'sphere', t);
      }),
    ];
    case 'fruit': return [form('sphere', 1.02, .88, .97), p(foliage, .14, .89, .05, .43, .13, .22, 'sphere'), p(bark, 0, .91, 0, .09, .24, .09, 'pole')];
    case 'cup': return [form('pole', .85, .84, .85), p(b, 0, .84, 0, .74, .14, .74, 'ring'), p(ivory, .52, .53, 0, .36, .16, .42, 'ring', 0, Math.PI / 2)];
    case 'basket': return [
      form('hull', 1.73, .67, 1.22, a), p(ivory, 0, .65, 0, 1.5, .19, 1.05, 'hull'),
      p(bark, 0, .83, 0, 1.29, .19, 1.29, 'ring', 0, Math.PI / 2), p(b, .19, .87, .1, .56, .47, .48, 'sphere'),
    ];
    case 'screw': case 'pencil': return [
      p(b, 0, .18, 0, .25, 1.41, .25, 'pole', 0, 0, Math.PI / 2),
      p(a, -.62, .18, 0, .43, .26, .43, 'pole', 0, 0, Math.PI / 2),
      p(ivory, .71, .18, 0, .24, .33, .24, 'cone', 0, 0, -Math.PI / 2),
    ];
    case 'nut': case 'clip': return [p(a, 0, .14, 0, 1.12, .28, name === 'nut' ? 1.12 : .51, 'ring')];
    case 'cutlery': case 'wrench': return [
      p(b, -.16, .12, 0, 1.23, .18, .21, 'sphere'),
      p(a, .57, .14, 0, .54, .2, .51, name === 'wrench' ? 'ring' : 'sphere'),
    ];
    case 'vise': return [
      form('box', 1.47, .25, .97, metal), p(b, -.42, .55, 0, .58, .66, .74), p(b, .46, .55, 0, .48, .67, .74),
      p(a, -.25, .89, 0, .33, .22, .81), p(a, .31, .89, 0, .33, .22, .81),
      p(metal, .23, .48, 0, .17, 1.35, .17, 'pole', 0, 0, Math.PI / 2),
    ];
    case 'brick': return [
      form('box', 1.62, .54, .96), ...[-.53,0,.53].flatMap(x => [-.23,.23].map(z => p(b, x, .58, z, .28, .16, .28, 'pole'))),
    ];
    case 'toy': return [
      form('pole', .68, .17, .68, b), p(a, 0, .57, 0, .48, .78, .31),
      p(ivory, 0, 1.02, 0, .38, .42, .38, 'sphere'), p(metal, 0, 1.21, 0, .42, .16, .42, 'pole'),
    ];
    case 'train': case 'rover': return [
      form('box', 1.7, .38, .92), p(ivory, -.25, .62, 0, .63, .48, .72),
      p(glass, -.06, .69, 0, .32, .21, .74), p(b, .48, .49, 0, .54, .28, .69),
      ...[-.55,.55].flatMap(x => [-.43,.43].map(z => p(metal, x, .24, z, .41, .41, .24, 'wheel'))),
    ];
    case 'keyboard': return [
      form('box', 1.95, .19, .83, metal),
      ...Array.from({length:7}, (_,x) => [0,1,2].map(z => p(z === 2 && x % 3 === 0 ? a : b, (x - 3) * .246, .22, (z - 1) * .23, .2, .095, .18))).flat(),
    ];
    case 'beacon': case 'sign': return [
      form('box', .48, .16, .46, metal), p(metal, 0, .51, 0, .095, .9, .095, 'pole'),
      p(a, 0, .98, 0, name === 'sign' ? .84 : .32, .35, .19, name === 'sign' ? 'box' : 'gem'),
    ];
    case 'solar': return [
      form('pole', .25, .5, .25, metal), p(0x456f9a, 0, .59, 0, 1.76, .09, .91, 'box', 0, -.3),
      ...[-.62,-.31,0,.31,.62].map(x => p(glass, x, .65, 0, .022, .022, .91, 'box', 0, -.3)),
    ];
    case 'drone': return [
      p(a, 0, .55, 0, .79, .29, .59, 'sphere'),
      ...[-1,1].flatMap(x => [-1,1].flatMap(z => [
        p(metal, x * .28, .56, z * .22, .64, .07, .105, 'box', -x * z * .65),
        p(metal, x * .53, .59, z * .38, .46, .08, .46, 'ring'),
        animated(p(ivory, x * .53, .604, z * .38, .32, .022, .052), 'spin', x * z),
        p(0x66e7ef, x * .53, .56, z * .38, .125, .08, .125, 'sphere'),
      ])),
      p(metal, .38, .48, 0, .25, .21, .26, 'sphere'),
      p(glass, .49, .49, 0, .085, .125, .125, 'sphere'),
    ];
    case 'shuttle': return [
      p(ivory, 0, .42, 0, 1.92, .49, .8, 'ship'),
      p(a, -.17, .38, 0, 1.33, .13, 1.6, 'ship'),
      p(glass, .29, .67, 0, .58, .27, .45, 'sphere'),
      ...[-1, 1].flatMap(side => [
        p(metal, -.49, .43, side * .5, .34, .72, .36, 'pole', 0, 0, Math.PI / 2),
        p(0x53ddf8, -.86, .43, side * .5, .19, .18, .25, 'sphere'),
        p(b, -.47, .72, side * .52, .41, .54, .11, 'pyramid'),
        p(a, .02, .52, side * .32, .73, .055, .063),
      ]),
    ];
    case 'dome': return [
      form('pole', 1.7, .32, 1.7, metal), p(glass, 0, .38, 0, 1.63, 1.18, 1.63, 'sphere'),
      p(a, 0, .35, 0, 1.78, .17, 1.78, 'ring'), p(b, 0, .24, .73, .47, .36, .54),
    ];
    case 'module': case 'airlock': return [
      form('box', 1.8, .67, 1.02, b), p(metal, 0, .57, 0, 1.74, .66, .75, 'pole', 0, 0, Math.PI / 2),
      p(a, .88, .52, 0, .79, .15, .79, 'ring', 0, 0, Math.PI / 2),
      p(glass, -.22, .79, .34, .48, .22, .12),
    ];
    case 'station': return [
      form('pole', 1.15, .52, 1.15, b), p(metal, 0, .72, 0, 1.4, .55, 1.37, 'pole'),
      p(a, 0, .76, 0, 1.91, .14, 1.91, 'ring'), p(glass, 0, 1.04, 0, .76, .46, .76, 'sphere'),
      p(a, 0, 1.44, 0, .09, .53, .09, 'pole'),
      animated(p(ivory, 0, 1.73, 0, .55, .13, .17, 'sphere'), 'spin'),
      ...[0,1,2,3,4,5].map(i => p(glass, .67 * Math.cos(i * Math.PI / 3), .89,
        .67 * Math.sin(i * Math.PI / 3), .22, .14, .11, 'box', -i * Math.PI / 3)),
    ];
    case 'neon': return [
      form('box', 1.16, 2.05, 1.05, b), p(metal, 0, 1.84, 0, .8, 1.27, .77),
      ...[.33,.66,1,1.35,1.69,2.03].map(y => p(a, 0, y, 0, 1.19, .062, 1.08)),
      p(white, 0, 2.65, 0, .09, .6, .09, 'pole'),
    ];
    case 'crystal': case 'spires': return [
      p(a, 0, .83, 0, .62, 1.68, .64, 'gem'),
      p(b, -.48, .48, 0, .42, 1.1, .41, 'gem', .6, 0, .37),
      p(a, .45, .57, .26, .34, 1.14, .45, 'gem', .3, 0, -.31),
      ...(name === 'spires' ? [p(glass, .32, 1.02, -.29, .51, 2.09, .53, 'gem', .3, 0, -.15)] : []),
    ];
    default: throw new Error(`Unknown landscape model: ${name}`);
  }
}


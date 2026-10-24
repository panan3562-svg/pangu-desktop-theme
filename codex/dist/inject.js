/*! 盘古开屏 · Codex / ChatGPT CDP 注入 | 由 build/build.mjs 生成，请改 shared/ 下的源码 */
(() => {
  if (window.top !== window) return;              // 只注入顶层页面
  if (window.__PANGU_INSTALLED__) return;         // 防重复注入
  const host = location.hostname;
  // 桌面版界面跑在本地 app:// 壳里；保留对 chatgpt.com / openai.com 的兼容。
  const allowed = location.protocol === 'app:'
    || host === 'chatgpt.com' || host === 'chat.openai.com' || host === 'openai.com' || host.endsWith('.chatgpt.com');
  if (!allowed) return;
  window.__PANGU_INSTALLED__ = true;
// 由 build/gen-art.mjs 从 pangu-cli-theme/pangu/assets/art.json 生成，请勿手改。
const ART = {"source":"huawei-mark.svg (vector trace of the Huawei mark)","petals":[[[58.59,20.71],[58.536,19.222],[58.222,17.783],[57.712,16.416],[57.067,15.149],[56.35,14.006],[55.624,13.014],[54.95,12.198],[54.392,11.583],[54.011,11.195],[53.87,11.06],[53.601,11.392],[52.842,12.357],[51.664,13.909],[50.139,16.001],[48.338,18.586],[46.332,21.618],[44.193,25.05],[41.992,28.835],[39.8,32.928],[37.69,37.28],[37.679,37.305],[37.67,37.333],[37.664,37.363],[37.66,37.393],[37.66,37.424],[37.663,37.454],[37.671,37.484],[37.682,37.512],[37.699,37.537],[37.72,37.56],[37.739,37.574],[37.76,37.587],[37.784,37.598],[37.809,37.607],[37.835,37.612],[37.863,37.615],[37.891,37.615],[37.92,37.611],[37.95,37.603],[37.98,37.59],[38.976,37.088],[40.37,36.367],[42.077,35.459],[44.012,34.396],[46.09,33.21],[48.226,31.934],[50.334,30.601],[52.329,29.243],[54.126,27.892],[55.64,26.58],[55.719,26.513],[55.932,26.317],[56.249,25.997],[56.635,25.557],[57.059,25.004],[57.487,24.342],[57.887,23.578],[58.226,22.716],[58.471,21.761],[58.59,20.72]],[[46.66,9.4],[46.622,9.276],[46.5,8.936],[46.279,8.425],[45.944,7.788],[45.481,7.071],[44.876,6.32],[44.113,5.579],[43.18,4.896],[42.06,4.314],[40.74,3.88],[40.7,3.87],[40.586,3.842],[40.405,3.799],[40.165,3.744],[39.874,3.68],[39.539,3.61],[39.169,3.537],[38.77,3.464],[38.351,3.394],[37.92,3.33],[37.774,3.547],[37.389,4.246],[36.845,5.501],[36.219,7.383],[35.591,9.966],[35.041,13.322],[34.646,17.524],[34.487,22.644],[34.642,28.755],[35.19,35.93],[35.195,35.969],[35.204,36.003],[35.215,36.031],[35.23,36.055],[35.246,36.075],[35.264,36.091],[35.283,36.104],[35.302,36.115],[35.321,36.123],[35.34,36.13],[35.37,36.137],[35.399,36.141],[35.427,36.141],[35.454,36.137],[35.48,36.129],[35.505,36.117],[35.528,36.101],[35.551,36.082],[35.571,36.058],[35.59,36.03],[36.27,35.034],[37.239,33.578],[38.425,31.741],[39.755,29.606],[41.154,27.254],[42.549,24.766],[43.866,22.223],[45.033,19.707],[45.976,17.299],[46.62,15.08],[46.643,14.983],[46.702,14.709],[46.781,14.286],[46.867,13.74],[46.943,13.099],[46.994,12.389],[47.005,11.637],[46.962,10.87],[46.848,10.116],[46.65,9.4]],[[39.39,41.22],[39.381,41.24],[39.374,41.264],[39.369,41.292],[39.366,41.321],[39.366,41.351],[39.371,41.382],[39.379,41.412],[39.394,41.441],[39.413,41.467],[39.44,41.49],[40.052,41.926],[40.835,42.473],[41.754,43.101],[42.771,43.778],[43.849,44.47],[44.95,45.147],[46.038,45.776],[47.076,46.326],[48.025,46.765],[48.85,47.06],[48.984,47.097],[49.364,47.169],[49.959,47.215],[50.737,47.174],[51.667,46.986],[52.719,46.591],[53.859,45.929],[55.057,44.938],[56.281,43.558],[57.5,41.73],[57.119,41.717],[56.065,41.68],[54.474,41.624],[52.48,41.555],[50.216,41.476],[47.819,41.393],[45.422,41.31],[43.16,41.232],[41.168,41.164],[39.58,41.11],[39.561,41.111],[39.541,41.115],[39.52,41.121],[39.499,41.129],[39.477,41.139],[39.457,41.151],[39.437,41.165],[39.419,41.182],[39.403,41.2],[39.39,41.22]],[[62.27,25.9],[61.836,26.134],[60.624,26.792],[58.77,27.808],[56.409,29.115],[53.676,30.648],[50.708,32.339],[47.638,34.123],[44.603,35.934],[41.739,37.705],[39.18,39.37],[39.162,39.383],[39.144,39.399],[39.127,39.417],[39.111,39.438],[39.097,39.462],[39.087,39.49],[39.08,39.52],[39.078,39.553],[39.081,39.59],[39.09,39.63],[39.097,39.651],[39.108,39.671],[39.121,39.691],[39.137,39.71],[39.155,39.726],[39.176,39.741],[39.199,39.753],[39.224,39.762],[39.251,39.768],[39.28,39.77],[40.343,39.771],[41.767,39.772],[43.443,39.773],[45.26,39.774],[47.111,39.774],[48.886,39.772],[50.474,39.769],[51.767,39.762],[52.656,39.753],[53.03,39.74],[53.07,39.738],[53.187,39.73],[53.374,39.711],[53.625,39.68],[53.932,39.632],[54.291,39.565],[54.695,39.474],[55.137,39.357],[55.611,39.21],[56.11,39.03],[56.218,38.992],[56.52,38.87],[56.982,38.653],[57.57,38.329],[58.251,37.887],[58.991,37.317],[59.757,36.606],[60.514,35.744],[61.23,34.719],[61.87,33.52],[61.918,33.418],[62.042,33.122],[62.213,32.651],[62.402,32.021],[62.58,31.251],[62.717,30.358],[62.783,29.358],[62.751,28.271],[62.589,27.112],[62.27,25.9]],[[28.14,39.37],[25.581,37.705],[22.717,35.934],[19.682,34.123],[16.612,32.339],[13.644,30.648],[10.911,29.115],[8.55,27.808],[6.696,26.792],[5.484,26.134],[5.05,25.9],[4.731,27.11],[4.569,28.267],[4.537,29.354],[4.603,30.353],[4.74,31.247],[4.918,32.019],[5.107,32.649],[5.278,33.121],[5.402,33.417],[5.45,33.52],[6.09,34.722],[6.806,35.748],[7.563,36.611],[8.329,37.321],[9.069,37.891],[9.75,38.332],[10.338,38.654],[10.8,38.871],[11.102,38.992],[11.21,39.03],[11.709,39.208],[12.183,39.353],[12.625,39.47],[13.029,39.561],[13.387,39.629],[13.695,39.677],[13.946,39.709],[14.133,39.729],[14.25,39.738],[14.29,39.74],[14.664,39.753],[15.553,39.763],[16.846,39.77],[18.434,39.775],[20.209,39.777],[22.06,39.778],[23.877,39.777],[25.553,39.776],[26.977,39.773],[28.04,39.77],[28.067,39.768],[28.092,39.762],[28.117,39.753],[28.14,39.741],[28.161,39.726],[28.18,39.71],[28.197,39.691],[28.211,39.671],[28.222,39.651],[28.23,39.63],[28.239,39.59],[28.242,39.553],[28.24,39.52],[28.233,39.49],[28.222,39.462],[28.209,39.438],[28.193,39.417],[28.176,39.399],[28.158,39.383],[28.14,39.37]],[[27.74,41.1],[26.152,41.156],[24.16,41.226],[21.898,41.304],[19.501,41.387],[17.104,41.47],[14.84,41.548],[12.846,41.616],[11.255,41.671],[10.201,41.707],[9.82,41.72],[11.039,43.548],[12.263,44.928],[13.461,45.919],[14.601,46.581],[15.652,46.976],[16.583,47.164],[17.361,47.205],[17.956,47.159],[18.336,47.087],[18.47,47.05],[19.295,46.755],[20.244,46.316],[21.282,45.766],[22.37,45.137],[23.471,44.46],[24.549,43.768],[25.566,43.091],[26.485,42.463],[27.268,41.916],[27.88,41.48],[27.909,41.454],[27.93,41.426],[27.945,41.396],[27.954,41.365],[27.957,41.334],[27.957,41.304],[27.953,41.275],[27.947,41.25],[27.939,41.228],[27.93,41.21],[27.917,41.19],[27.901,41.171],[27.883,41.153],[27.863,41.138],[27.842,41.125],[27.821,41.114],[27.8,41.106],[27.779,41.101],[27.759,41.099],[27.74,41.1]],[[26.57,3.87],[25.25,4.304],[24.13,4.886],[23.197,5.569],[22.434,6.31],[21.829,7.061],[21.366,7.778],[21.031,8.415],[20.81,8.926],[20.688,9.266],[20.65,9.39],[20.449,10.106],[20.334,10.86],[20.29,11.627],[20.302,12.379],[20.354,13.089],[20.43,13.73],[20.517,14.276],[20.597,14.699],[20.657,14.973],[20.68,15.07],[21.327,17.289],[22.271,19.697],[23.438,22.213],[24.756,24.756],[26.15,27.244],[27.548,29.596],[28.876,31.731],[30.062,33.568],[31.031,35.024],[31.71,36.02],[31.729,36.045],[31.75,36.068],[31.773,36.087],[31.798,36.103],[31.824,36.115],[31.85,36.124],[31.878,36.129],[31.905,36.13],[31.933,36.127],[31.96,36.12],[31.978,36.113],[31.997,36.105],[32.015,36.094],[32.033,36.081],[32.05,36.065],[32.066,36.045],[32.08,36.021],[32.092,35.993],[32.103,35.959],[32.11,35.92],[32.66,28.745],[32.817,22.634],[32.658,17.514],[32.264,13.312],[31.712,9.956],[31.084,7.373],[30.457,5.491],[29.912,4.236],[29.526,3.537],[29.38,3.32],[28.949,3.384],[28.53,3.454],[28.131,3.527],[27.761,3.6],[27.426,3.67],[27.135,3.734],[26.895,3.789],[26.714,3.832],[26.6,3.86],[26.56,3.87]],[[13.45,11.05],[13.309,11.185],[12.927,11.573],[12.368,12.188],[11.694,13.004],[10.966,13.996],[10.249,15.139],[9.604,16.406],[9.094,17.773],[8.782,19.212],[8.73,20.7],[8.849,21.741],[9.094,22.696],[9.433,23.558],[9.833,24.322],[10.261,24.984],[10.685,25.537],[11.071,25.977],[11.388,26.297],[11.601,26.493],[11.68,26.56],[13.194,27.872],[14.991,29.223],[16.986,30.581],[19.094,31.914],[21.23,33.19],[23.308,34.376],[25.243,35.439],[26.95,36.347],[28.344,37.068],[29.34,37.57],[29.37,37.583],[29.401,37.591],[29.431,37.595],[29.46,37.595],[29.489,37.592],[29.516,37.587],[29.541,37.578],[29.563,37.567],[29.583,37.554],[29.6,37.54],[29.621,37.517],[29.638,37.492],[29.649,37.464],[29.657,37.434],[29.66,37.404],[29.66,37.373],[29.656,37.343],[29.65,37.313],[29.641,37.285],[29.63,37.26],[27.52,32.913],[25.328,28.824],[23.127,25.041],[20.988,21.61],[18.982,18.579],[17.181,15.993],[15.656,13.901],[14.478,12.348],[13.719,11.382],[13.45,11.05]]],"word":[[[11.1,56.87],[6.62,56.87],[6.62,52.92],[4.63,52.92],[4.63,62.71],[6.62,62.71],[6.62,58.73],[11.1,58.73],[11.1,62.71],[13.09,62.71],[13.09,52.92],[11.1,52.92],[11.1,56.87]],[[22.29,58.52],[22.266,58.975],[22.196,59.384],[22.08,59.748],[21.92,60.066],[21.715,60.336],[21.467,60.559],[21.177,60.733],[20.845,60.859],[20.472,60.935],[20.06,60.96],[19.647,60.934],[19.274,60.856],[18.941,60.728],[18.649,60.549],[18.4,60.32],[18.194,60.042],[18.032,59.715],[17.915,59.341],[17.844,58.919],[17.82,58.45],[17.82,52.92],[15.83,52.92],[15.83,58.52],[15.876,59.309],[16.01,60.026],[16.233,60.668],[16.539,61.232],[16.929,61.716],[17.398,62.118],[17.945,62.434],[18.568,62.664],[19.264,62.803],[20.03,62.85],[20.798,62.802],[21.496,62.66],[22.123,62.427],[22.676,62.104],[23.151,61.695],[23.546,61.202],[23.859,60.627],[24.085,59.974],[24.223,59.244],[24.27,58.44],[24.27,52.92],[22.28,52.92],[22.28,58.52]],[[45.25,59.65],[43.03,52.92],[41.41,52.92],[39.19,59.65],[37.02,52.92],[34.91,52.92],[38.32,62.71],[39.97,62.71],[42.19,56.28],[44.42,62.71],[46.08,62.71],[49.48,52.92],[47.42,52.92],[45.25,59.65]],[[53.04,58.5],[56.66,58.5],[56.66,56.71],[53.04,56.71],[53.04,54.71],[58.29,54.71],[58.29,52.93],[51.08,52.93],[51.08,62.7],[58.48,62.7],[58.48,60.92],[53.04,60.92],[53.04,58.5]],[[60.85,52.92],[62.81,52.92],[62.81,62.7],[60.85,62.7]],[[32.69,60.67],[33.57,62.71],[35.65,62.71],[31.35,52.92],[29.6,52.92],[25.29,62.71],[27.32,62.71],[28.21,60.67],[32.69,60.67]],[[30.44,55.4],[31.95,58.9],[28.95,58.9],[30.45,55.4]]],"logo_bbox":[4.537,3.32,62.783,47.215],"word_bbox":[4.63,52.92,62.81,62.85],"origin":[33.66,43],"gradient":{"cx":40.607,"cy":8.549500000000002,"r":42.693,"stops":[[0,[242,150,128]],[0.43,[215,23,24]],[1,[151,30,35]]]},"slogans":{"codex":{"text":"让想法，码上成真","sizes":[{"rows":3,"cols":53,"bits":["8008000000000000400000000","ffc2800180ffc0000431f90184","c0ffe01808180003fa19fc188","7f80c601809880000601fb8180","7f84863f808b80000411ff8f87","7f86be0181fbc0003fe1994184","7f83b60181fac0000701f90184","7f83b6018102800013208a0184","1ffc9b601817e800431319a819c","630fda01810380063d9162c19c","1c1c6633ff9e280046f987e4fe4","60000000000"]},{"rows":4,"cols":68,"bits":["8000000000000000000000000000","3ffe0d80001007ffe000001818fe30040c","3fff0d80001007f7e000001870fefc0418","c03fff00100620800001ff60fefc0410","1ffc018300100230c00001ff00fe700400","1ffc098307f00230c000001818c6f87c1e","1ffc19bf07f00317c000001830febcfc1e","1ffc0dbf00100ff6e00003ffa0c6340418","1c0c0f3300100ff6e00001ff80fe300418","1ffc073300100c06c000000c6000000418","1c0c073300100dfec00000c66043580418","7fff373d00100dfec000618630c6580438","e1837dd80180c07c000e1e331b04c0c38","3c1e3ce19fffc7c7c000c3ff98bfccffd8","300718608fffc3c040004303101f80ff80","60000000000000"]},{"rows":5,"cols":85,"bits":["0","1c001d800001c007fc000000001c020ff8e003018","ffffc19800001c00ffffc0000001c070ff8e003038","7fff87fff8001c00601f80000001c0e0c1bfc03070","1ffe07fffc001c0061830000003ffc80ffbfc03020","3ffe001c1c001c0061830000001ffc00ff8e003000","300600180c0ffc00618300000001c030c1bf00301e","3ffe03180c1ffc00619f80000001c070ffff8ff03e","38060399fc0ffc00719f80000001c0e0ffafc7f038","3ffe01b9fc001c01ffdbc000003ffe40c18ec03030","3ffe01b98c001c01ffdbc000003ffe00ff8e003030","3ffe00f18c001c01801bc00000006080ff0c003030","3ffe00f18c001c01801b0000000c70c06098003030","380700718c001c01ffdb0000000c30c0619b0030b0","ffffc671ec001c00dfdb00001c1c38e0c39b8030f0","ffffc6fcee001c00c01f00003c3e1c61d8198030f0","3c1e07de063ffff8e01f0000383ffe719ff9cfff78","f007c787073ffff8fc1b00003031fe301ff88fff10","40018202020000003c000000183000200000000000","c0000000000000000"]},{"rows":6,"cols":102,"bits":["0","1c00019c000000c00000000000000000e004000018001c010","1ffffe039c000000c000ffeff000000000e00e0ffc18001c038","1ffffe0718000000c000ffeff000000000e03c0ffc3c001c070","1e001fffff0000c000c001c00000003fff380e0cff801c0e0","7fff01fffff0000c000e180c00000003fff300ffcff801c040","7fff81fffff0000c000e1c0c00000003fff000ffc3c001c000","700380018070000c000e1c0e000000000e0060e0c7e001c000","7fff802380703ffc000e0c0e000000000e00f0ffcfe07fc07e","7fff806380703ffc00060cfe000000000e01e0ffddf07fc07e","600380739ff0000c00060cff00000003fff9c0e0c9987fc070","7fff80739ff0000c003ffeef00000007fffc80e0c19801c070","7fff803b9c70000c003ffeef80000007fffc00ffc18801c070","7003803f1c70000c003800ef80000000038100ffc18001c070","7fff801f1c70000c003800ee0000000043830000000001c070","7fff801f1c70000c003bfeee00000000e1c38070672001c070","3fffff08f1c70000c003bfeee00000001c1c380f0e77001c170","3fffff18f0fb0000c003bfeee00000701c0e1c0e1c77001c3f0","3fffff19fcfb8000c001800fe00000f83c0e1c1dc073801c3f0","7c0f01fde3387ffffe1c00fe00000f03fff0e39c0738fffcf0","1f007e0f8f81c7ffffe1fe0ee00000c07fff8e08fff18fffe70","3c001e0f0781c7ffffe0fe00e0000060703f8600ffe00fffe30","100006000100000000001c00000000600000000000000000000","380000000000000000000"]}]},"claude":{"text":"从一行代码，打开新的可能","sizes":[{"rows":3,"cols":79,"bits":["1000000000000000400000000000","b18ffe0621ef8ffc7e40000ffe14c3f20000108","f4c2003ef02f831038f0000c082440030000108","11fc2003ef825831010f0000c8c7c60058000108","1b7827c239bffc3101040000c9c1ff3fe0000108","e7c24420d9a30ffe11c0000fbc0471831ffc188","17c24424f8afc31010f0001fb6046083800039c","1f4c27c2c98b3031810700018340c608200002bc","37c20420d8b783181040011ff448608200006e4","114c20020f89ac30c104003883c5860820000c46","1f6c380381893c3061c70010f2c7060e20000c62","100000000000000000"]},{"rows":4,"cols":101,"bits":["800000000000000","c30fffe03083e0c0fff0003000003fbf068c0fe6000000c30","fd98fffe030c1f7f8fff9ff3000003fbf0c8c1ff7000000c30","7d9c30007f3e0133030c030fc0000310c08860003800000c30","8ffc30007fbf0132030c030fc000031843d860005c00000c30","18c0033f861e33f7f830c03030000031863fff1ffc000000c30","fdf8331860a33f7f9fff83030000011be01ff9ff6000000c10","71983308633f190c1fffc30f000007fb7018686031fffc1c38","df83308673f197f830c0307c00007fb701860603c00001c78","edf833f86623193f030c0303c0000603601860602800001ed8","fd8833f8642319af03040303000006fb6030606020000036d8","df83008603319af030603030000c6ff62306060200000670c","18d883000603f19ed030703030001c603e3606060200000630e","1fdc83e003c3318cd830383e3c00187c3e3c06078200000c186","f9c81e003c02188e030183c1c00083c04180603c2000004002","c000000000000000000000"]},{"rows":5,"cols":127,"bits":["0","70600000000c180e00c000000000180000007fc0006c700001800000006060","e72707fffe00c1c1feff87fffc7ff180000007fdfc0ec301ff9c00000006060","ff7307fffe00e0c01eff87fff87ff18000000601fc1cc301ff8e00000006060","1f618180003fe7f0062300e0c00e0ff0000006183008c380000700000006060","7ffc180003fe7f0066300e0c00e0ff0000006183038c1c0001380000006060","187c3c18ff8303630067700e0c00e018000000718187ff9c0003180000006060","c77f818ff8303e31feffc0e0c00e01800000031df807fde3ffb800000006060","fe7f818e18301631feff8ffffe0e09800000030dfc00cdf3ff9c0000000e060","3861818e1830c7f0e60c0ffffe0e0f8000000ffd9c00c1b0600e1ffffc0f0f0","761818e1830c7f0e6ff80e0c00e07e000000ffd9e01c180600f1ffffc0f1f0","877f818e18318630e6ff80e0e00e01f000000c019c018180600f8000001f1f0","ff61818ff8338630e60c00e0e00e019000000c0198018180600c0000001b3b8","3f618187f8310630e67f00e0600e018000000dff98038180600c0000003bb38","77f818018300630e76d80e0700e018000070dfd98630180600c0000003181c","187618180003807f0e3cd80e0300e0180000f0c01f8670180600c00000071c1c","1c76181c0003807f0e38dc0e03c0e0180000e0e01f86e0180600c000000e0e0e","fe7981f8001f0630e38ec0e01c07c1e0000c07e1983c01807e0c000000c0606","7c3980f8000e0000610e00400003c0e0000603c0003801803c0c00000000000","3000000000000000000000000000"]},{"rows":6,"cols":152,"bits":["0","6030000000001c0e0180070000000000006000000000000000270c000003000000000301c0","60381fffff800c0e03fe0700fffff07ff8600000000fffff80771c01ffe7000000000301c0","3fe3381fffff800e0603fefff0fffff0fff86000000007ffff80e70e01ffe3800000000301c0","3fe71c1fffff800e07000efff00e0700fff86000000006000e01c70e01ffe3c00000000301c0","3e70e03800007fe7fc00610c00e07000e03fe000000060c0e008707000001e00000000301c0","6fff03800007ff7fc00638c00e07000e03fe000000070e06070707000000f00000000301c0","307dff0387fc060770c00639c00e07000e00f0000000070e0607ff0380000e300000000380c0","306400038ffe0603f0c7fefff00e07000e0060000000070e0707fffbc3ffff100000000380c0","3fe7fe038ffe0601f0c7fefff00e07000e0060000000070e7f000ffbe3fff7000000000780c0","3fe7fe038e0e060170c1ee0701fffff80e066000000007067f800603e0700381fffff80780e0","70e038e0e060e7fc0c60601fffff80e07e00000001ffe67800603607003c1fffffc0781e0","670e038e0e061c7fc0c67ff00e07000e03f80000001fff67c00e03007003f1fffff80f83e0","67fe038e0e061c71c0c67ff00e07000e00fe0000001c0067c00e03007003f00000000fc7e0","3fe7fe038ffe063870c0c60f000e03000e007e0000001c0067000e03007003b00000000dcf70","3fe70e038ffe063070c0c736400e03800e00600000001dff67001c03007003800000001dce70","3e7fe0387fe061070c0c736e00e03800e00600000001dff67041c030070038000000018ec70","67fe03800e060071c0c776e00e03c00e006000001c1dff670e18030070038000000038e038","30670e03800007007fc0c366600e01c00e006000003e1c007f0e38030070038000000070703c","30670e03800007007fc0c3e6700e00e00e006000003c0c007f0670030070038000000070781e","3fe7ce03f80007f070c0c387700e00f80fe07c0000300ff07707e003007f0380000000e03c0e","3fe7ce03f80003f000c0c187a00e003007e07c00003007e00703c003003f038000000060180c","18600f00000000000c0038000000000000000001801e000010003001f0380000000000000","c00000000000000000000000000000000"]}]}}};

// 盘古 · 桌面开屏动画引擎（DSH 与 Codex 共用）
// ---------------------------------------------------------------
// 把上游 pangu-cli-theme 的终端字符动画，重画成 Canvas 版本：
//   1) 光标闪两下 → 代码字符向中心收拢
//   2) 八片花瓣从交汇点长出、先内后外展开，边缘闪过代码字符，内部是华为红渐变
//   3) HUAWEI 字标从左到右「解码」出来
//   4) 一道光扫过整个标志
//   5) 标语 / 副标语 / 平台行淡入，整层淡出交还界面
// 依赖：ART（art.data.js，由 build/gen-art.mjs 生成）
// 导出：createPangu(options) → 控制器 { start, skip, destroy, renderAt, el }

const THEMES = {
  dark: {
    bg: '#0e0f12', ink: '#eee9e4', soft: '#c4bdb8', muted: '#807977',
    red: '#e8343c', rule: '#5c262b', chipBg: 'rgba(20,21,25,.92)',
    chipLine: 'rgba(255,255,255,.14)', chipText: '#e8e3de', hover: 'rgba(255,255,255,.10)',
  },
  light: {
    bg: '#fafafa', ink: '#1e1a1b', soft: '#464040', muted: '#7a7472',
    red: '#c7000b', rule: '#e6bec0', chipBg: 'rgba(255,255,255,.94)',
    chipLine: 'rgba(0,0,0,.12)', chipText: '#2a2526', hover: 'rgba(0,0,0,.06)',
  },
};

const CODE = '0101010110{}<>/=;+*#';
const PETAL_BBOX = { x: 4.537, y: 3.32, w: 58.246, h: 43.895 };
const WORD_BBOX = { x: 4.63, y: 52.92, w: 58.18, h: 9.93 };
const LOCK = { x: 4.537, y: 3.32, w: 58.273, h: 59.53 };

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t), 3);
const easeInOut = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
const easeOutBack = (t, s = 1.22) => { t = clamp(t) - 1; return t * t * ((s + 1) * t + s) + 1; };

/** 上游时间轴（毫秒）。改这里就能整体变速。 */
const T = {
  cursor: [0, 300],
  particles: [40, 430],
  petals: [280, 1180],
  word: [1120, 1900],
  sweep: [1900, 2480],
  subtitles: [2200, 2840],
  fadeOut: [2900, 3320],
};

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgba(rgb, a) {
  return `rgba(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0},${a})`;
}
function mix(a, b, t) {
  t = clamp(t);
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/** 花瓣几何：质心、到交汇点的距离、方位角、内外顺序。 */
function petalGeometry() {
  const [ox, oy] = ART.origin;
  const out = ART.petals.map((poly) => {
    let mx = 0, my = 0;
    for (const p of poly) { mx += p[0]; my += p[1]; }
    mx /= poly.length; my /= poly.length;
    const dx = mx - ox, dy = my - oy;
    return {
      poly, cx: mx, cy: my,
      dist: Math.hypot(dx, dy),
      angle: Math.atan2(dx, -dy), // 从正上方起算，顺时针为正
    };
  });
  // 内圈先长：按到交汇点的距离排序；绘制顺序外圈在前、内圈压在上层
  const order = out.map((_, i) => i).sort((a, b) => out[a].dist - out[b].dist);
  order.forEach((idx, rank) => { out[idx].rank = rank; });
  return { petals: out, order };
}

function pathPoly(ctx, poly) {
  ctx.beginPath();
  ctx.moveTo(poly[0][0], poly[0][1]);
  for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
  ctx.closePath();
}

/** 把一个多边形追加进已有 Path2D（不做 beginPath，用于求并集）。 */
function addPoly(path, poly) {
  path.moveTo(poly[0][0], poly[0][1]);
  for (let i = 1; i < poly.length; i++) path.lineTo(poly[i][0], poly[i][1]);
  path.closePath();
}

function pickSloganSize(sizes, targetRows) {
  if (!sizes || !sizes.length) return null;
  let best = sizes[0];
  let bestD = Infinity;
  for (const s of sizes) {
    const d = Math.abs(s.rows - targetRows);
    if (d < bestD) { bestD = d; best = s; }
  }
  return best;
}

/**
 * 创建一次开屏播放。
 * options:
 *   brand      'codex' | 'dsh'      决定标语位图与文案
 *   theme      'dark' | 'light'
 *   strings    { slogan, tagline, platform }
 *   pixelSlogan boolean             是否用上游像素位图（Codex）还是文字（DSH）
 *   onSkip     () => void
 *   onDisable  () => void|Promise   用户点了「不再自动播放」
 *   onDone     () => void           播放结束 / 被跳过后
 */
function createPangu(options) {
  const opts = options || {};
  const pal = THEMES[opts.theme === 'light' ? 'light' : 'dark'];
  const strings = opts.strings || {};
  const petalGeo = petalGeometry();

  let host = null;
  let canvas = null;
  let ctx2d = null;
  let raf = 0;
  let startTs = 0;
  let finished = false;
  let skipRequested = false;
  let fadeStart = -1;
  let layout = null;
  let controls = null;

  const isReduced = () =>
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 布局：把 SVG 坐标系映射到屏幕 ----
  function computeLayout() {
    const vw = host ? host.clientWidth : window.innerWidth;
    const vh = host ? host.clientHeight : window.innerHeight;
    const k = Math.min((vw * 0.55) / LOCK.w, (vh * 0.46) / LOCK.h);
    const lockW = LOCK.w * k;
    const lockH = LOCK.h * k;
    const left = (vw - lockW) / 2;
    const top = Math.max(24, (vh - lockH) / 2 - Math.min(56, vh * 0.06));
    return { vw, vh, k, lockW, lockH, left, top };
  }

  function setSvgTransform() {
    const { k, left, top } = layout;
    const dpr = ctx2d.__dpr || 1;
    ctx2d.setTransform(dpr * k, 0, 0, dpr * k, dpr * (left - LOCK.x * k), dpr * (top - LOCK.y * k));
  }
  function setCssTransform() {
    const dpr = ctx2d.__dpr || 1;
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---- 元素绘制 ----
  function drawParticles(t) {
    const [t0, t1] = T.particles;
    const p = clamp((t - t0) / (t1 - t0));
    if (p <= 0 || p >= 1) return;
    const [ox, oy] = ART.origin;
    setCssTransform();
    const { k, left, top } = layout;
    const cx = left + (ox - LOCK.x) * k;
    const cy = top + (oy - LOCK.y) * k;
    const n = 18;
    // 字号按屏幕像素恒定（否则大窗口下会随 k 放大成巨字）
    const fs = Math.min(22, Math.max(10, 9 + k * 1.1));
    ctx2d.font = `${fs}px ui-monospace, "Cascadia Mono", "Consolas", monospace`;
    ctx2d.textAlign = 'center';
    ctx2d.textBaseline = 'middle';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + i * 0.7;
      const r = (1 - p) * (40 + ((i * 37) % 90)) * Math.min(1.4, k * 1.2);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * 0.8;
      const ch = CODE[(i * 7 + Math.floor(t / 90)) % CODE.length];
      ctx2d.fillStyle = rgba(mix(hexToRgb(pal.red), [255, 255, 255], 0.35), 0.55 * (1 - p));
      ctx2d.fillText(ch, x, y);
    }
  }

  function drawCursor(t) {
    const [t0, t1] = T.cursor;
    if (t < t0 || t > t1 + 80) return;
    const phase = (t - t0) % 140;
    const on = phase < 84;
    if (!on) return;
    const [ox, oy] = ART.origin;
    const { k, left, top } = layout;
    const x = left + (ox - LOCK.x) * k;
    const y = top + (oy - LOCK.y) * k;
    const w = Math.max(2, 3 * Math.min(1.6, k));
    const h = Math.max(12, 22 * Math.min(1.5, k));
    setCssTransform();
    const g = ctx2d.createRadialGradient(x, y, 0, x, y, h * 1.6);
    g.addColorStop(0, rgba(hexToRgb(pal.red), 0.55));
    g.addColorStop(1, rgba(hexToRgb(pal.red), 0));
    ctx2d.fillStyle = g;
    ctx2d.fillRect(x - h * 1.6, y - h * 1.6, h * 3.2, h * 3.2);
    ctx2d.fillStyle = pal.red;
    ctx2d.fillRect(x - w / 2, y - h / 2, w, h);
  }

  function petalTiming(i) {
    const { petals } = petalGeo;
    const inner = petals[i].rank <= 1;
    return { start: T.petals[0] + (inner ? 0 : 80) + petals[i].rank * 52, dur: 520 };
  }

  /** 单片的生长过程：位置从交汇点外推、绕自身质心旋转、由小到大。 */
  function drawPetal(i, t, opts2) {
    const { petals } = petalGeo;
    const petal = petals[i];
    const { start, dur } = petalTiming(i);
    const p = clamp((t - start) / dur);
    if (p <= 0) return;
    const e = easeOutBack(p, 1.18);
    const grow = clamp(lerp(0.04, 1, e), 0, 1.35);
    const [ox, oy] = ART.origin;
    const px = lerp(ox, petal.cx, easeOutCubic(p));
    const py = lerp(oy, petal.cy, easeOutCubic(p));
    const rot = petal.angle * (1 - easeOutCubic(p)) * 1.05;

    setSvgTransform();
    ctx2d.save();
    ctx2d.translate(px, py);
    ctx2d.rotate(rot);
    ctx2d.scale(grow, grow);
    ctx2d.translate(-petal.cx, -petal.cy);

    // 内部渐变（与上游 SVG 同一个径向渐变）
    const gd = ART.gradient;
    const grad = ctx2d.createRadialGradient(gd.cx, gd.cy, 0, gd.cx, gd.cy, gd.r);
    for (const [stop, c] of gd.stops) {
      grad.addColorStop(stop, `rgb(${c[0]},${c[1]},${c[2]})`);
    }
    pathPoly(ctx2d, petal.poly);
    ctx2d.fillStyle = grad;
    ctx2d.globalAlpha = clamp(p * 2.2);
    ctx2d.fill();
    ctx2d.globalAlpha = 1;

    // 边缘代码字符：随填充固化而消退
    const shimmer = 1 - clamp((p - 0.42) / 0.4);
    if (shimmer > 0.02) {
      const step = Math.max(2, Math.floor(petal.poly.length / 14));
      const spread = Math.min(1.06, 0.55 + grow * 0.5);
      // SVG 空间里的字号要除以 (k * grow)，屏幕上才恒为 ~11px
      ctx2d.font = `${(11 / Math.max(0.001, layout.k * Math.max(0.2, grow))).toFixed(2)}px ui-monospace, "Cascadia Mono", "Consolas", monospace`;
      ctx2d.textAlign = 'center';
      ctx2d.textBaseline = 'middle';
      for (let k2 = 0; k2 < petal.poly.length; k2 += step) {
        const [x0, y0] = petal.poly[k2];
        const ch = CODE[(k2 * 13 + Math.floor(t / 70)) % CODE.length];
        ctx2d.save();
        ctx2d.translate((x0 - petal.cx) * spread + petal.cx, (y0 - petal.cy) * spread + petal.cy);
        ctx2d.rotate(-rot);
        ctx2d.fillStyle = rgba(mix([255, 255, 255], hexToRgb(pal.red), 0.35), 0.85 * shimmer);
        ctx2d.fillText(ch, 0, 0);
        ctx2d.restore();
      }
    }
    ctx2d.restore();
  }

  function drawWord(t) {
    const [t0, t1] = T.word;
    if (t < t0) return;
    const p = clamp((t - t0) / (t1 - t0));
    const e = easeInOut(p);
    const revealX = lerp(WORD_BBOX.x - 2, WORD_BBOX.x + WORD_BBOX.w + 2, e);
    setSvgTransform();
    ctx2d.save();
    ctx2d.beginPath();
    ctx2d.rect(WORD_BBOX.x - 4, WORD_BBOX.y - 6, revealX - WORD_BBOX.x + 4, WORD_BBOX.h + 12);
    ctx2d.clip();
    ctx2d.fillStyle = pal.ink;
    for (const poly of ART.word) { pathPoly(ctx2d, poly); ctx2d.fill(); }
    // 解码前沿：一串随机字符
    if (p < 1) {
      // 解码前沿的字符同样按屏幕像素恒定
      ctx2d.font = `${(12 / layout.k).toFixed(2)}px ui-monospace, "Cascadia Mono", "Consolas", monospace`;
      ctx2d.textAlign = 'center';
      ctx2d.textBaseline = 'middle';
      for (let i = 0; i < 16; i++) {
        const x = revealX - 4 - i * 3.2;
        if (x < WORD_BBOX.x - 4) break;
        const ch = CODE[(i * 11 + Math.floor(t / 45)) % CODE.length];
        ctx2d.fillStyle = rgba(hexToRgb(pal.red), 0.85 * (1 - i / 16));
        ctx2d.fillText(ch, x, WORD_BBOX.y + WORD_BBOX.h / 2 + ((i % 3) - 1) * 2.2);
      }
    }
    ctx2d.restore();
  }

  function drawSweep(t) {
    const [t0, t1] = T.sweep;
    if (t < t0 || t > t1) return;
    const p = clamp((t - t0) / (t1 - t0));
    const e = easeInOut(p);
    setSvgTransform();
    ctx2d.save();
    // 只在标志 + 字标范围内扫过（Path2D 求并集；pathPoly 会重置路径，不能直接复用）
    const clip = new Path2D();
    for (const poly of ART.petals) addPoly(clip, poly);
    for (const poly of ART.word) addPoly(clip, poly);
    ctx2d.clip(clip);
    const bandW = 18;
    const x = lerp(LOCK.x - bandW, LOCK.x + LOCK.w + bandW, e);
    const g = ctx2d.createLinearGradient(x - bandW, LOCK.y, x + bandW, LOCK.y + LOCK.h);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.42, 'rgba(255,255,255,0.10)');
    g.addColorStop(0.5, 'rgba(255,236,226,0.62)');
    g.addColorStop(0.58, 'rgba(255,255,255,0.10)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx2d.fillStyle = g;
    ctx2d.fillRect(x - bandW, LOCK.y, bandW * 2, LOCK.h);
    ctx2d.restore();
  }

  /** 取十六进制串第 x 位（x 从最低位算起）。逐字符取半字节，避免超出 53 位精度。 */
  function bitAt(hex, x) {
    const idx = hex.length - 1 - (x >> 2);
    if (idx < 0) return 0;
    const nibble = parseInt(hex[idx], 16);
    return (nibble >> (x & 3)) & 1;
  }

  function drawPixelSlogan(size, centerX, topY, targetW, alpha) {
    if (!size || alpha <= 0) return null;
    setCssTransform();
    const bits = size.bits;
    const cols = size.cols * 2;
    const s = Math.min(targetW / cols, 5.2);
    const w = cols * s;
    const x0 = centerX - w / 2;
    ctx2d.fillStyle = rgba(hexToRgb(pal.soft), alpha);
    for (let r = 0; r < bits.length; r++) {
      for (let c = 0; c < cols; c++) {
        if (bitAt(bits[r], c)) ctx2d.fillRect(x0 + c * s, topY + r * s, s - 0.35, s - 0.35);
      }
    }
    return { w, h: bits.length * s };
  }

  function drawSubtitles(t) {
    const [t0] = T.subtitles;
    if (t < t0) return;
    setCssTransform();
    const cx = layout.vw / 2;
    let y = layout.top + layout.lockH + Math.max(18, 26 * Math.min(1.4, layout.k * 1.3));

    // 标语
    const sp = clamp((t - t0) / 420);
    if (sp > 0) {
      const targetW = Math.min(layout.lockW * 0.95, 640);
      if (opts.pixelSlogan) {
        const slogan = ART.slogans && ART.slogans[opts.brand || 'codex'];
        // 高分屏用 6 行位图（笔画更细）；窗口窄到格子小于 1.7px 时退回 4 行。
        const sixCells = targetW / ((slogan && slogan.sizes.find((s) => s.rows === 6)?.cols * 2) || 1);
        const size = pickSloganSize(slogan && slogan.sizes, sixCells >= 1.7 ? 6 : 4);
        const box = drawPixelSlogan(size, cx, y, targetW, Math.min(1, sp * 1.15));
        if (box) y += box.h + 16;
      } else if (strings.slogan) {
        const fs = Math.max(17, Math.min(30, layout.lockW * 0.075));
        ctx2d.font = `300 ${fs}px "Segoe UI", "Microsoft YaHei UI", system-ui, sans-serif`;
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'alphabetic';
        const chars = Array.from(strings.slogan);
        const spacing = fs * 0.16;
        const widths = chars.map((c) => ctx2d.measureText(c).width);
        const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
        let x = cx - total / 2;
        ctx2d.fillStyle = rgba(hexToRgb(pal.soft), sp * 0.95);
        for (let i = 0; i < chars.length; i++) {
          const ca = clamp((t - t0 - i * 18) / 320);
          if (ca > 0) {
            ctx2d.globalAlpha = ca * 0.95;
            ctx2d.fillText(chars[i], x, y + fs);
          }
          x += widths[i] + spacing;
        }
        ctx2d.globalAlpha = 1;
        y += fs + 16;
      }
    }

    // 副标语（字距拉开的大写英文）
    const tp = clamp((t - t0 - 160) / 300);
    if (tp > 0 && strings.tagline) {
      const fs = Math.max(11, Math.min(13, layout.lockW * 0.028));
      ctx2d.font = `400 ${fs}px "Segoe UI", system-ui, sans-serif`;
      ctx2d.textAlign = 'left';
      ctx2d.textBaseline = 'alphabetic';
      const text = String(strings.tagline).toUpperCase();
      const spacing = fs * 0.42;
      const widths = Array.from(text).map((c) => ctx2d.measureText(c).width);
      const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
      let x = cx - total / 2;
      ctx2d.fillStyle = rgba(hexToRgb(pal.muted), tp * 0.9);
      for (let i = 0; i < text.length; i++) {
        ctx2d.fillText(text[i], x, y);
        x += widths[i] + spacing;
      }
      y += 22;
    }

    // 平台行：——  盘古大模型 · …  ——
    const pp = clamp((t - t0 - 260) / 340);
    if (pp > 0 && strings.platform) {
      const fs = Math.max(11, Math.min(14, layout.lockW * 0.03));
      ctx2d.font = `400 ${fs}px "Segoe UI", "Microsoft YaHei UI", system-ui, sans-serif`;
      ctx2d.textAlign = 'center';
      ctx2d.textBaseline = 'alphabetic';
      const line = strings.platform;
      const w = ctx2d.measureText(line).width;
      ctx2d.fillStyle = rgba(hexToRgb(pal.rule), pp * 0.9);
      ctx2d.fillText('────', cx - w / 2 - 26, y);
      ctx2d.fillText('────', cx + w / 2 + 26, y);
      ctx2d.fillStyle = rgba(hexToRgb(pal.red), pp * 0.92);
      ctx2d.fillText(line, cx, y);
    }
  }

  function drawStatic() {
    // 减少动态：直接画终态
    setSvgTransform();
    ctx2d.fillStyle = pal.ink;
    for (const i of petalGeo.order) {
      const petal = petalGeo.petals[i];
      const gd = ART.gradient;
      const grad = ctx2d.createRadialGradient(gd.cx, gd.cy, 0, gd.cx, gd.cy, gd.r);
      for (const [stop, c] of gd.stops) grad.addColorStop(stop, `rgb(${c[0]},${c[1]},${c[2]})`);
      pathPoly(ctx2d, petal.poly);
      ctx2d.fillStyle = grad;
      ctx2d.fill();
    }
    ctx2d.fillStyle = pal.ink;
    for (const poly of ART.word) { pathPoly(ctx2d, poly); ctx2d.fill(); }
    drawSubtitles(T.subtitles[1]);
  }

  function frame(ts) {
    if (!startTs) startTs = ts;
    const t = ts - startTs;
    render(t);
    if (finished) return;
    if (t >= T.fadeOut[1]) { finish(); return; }
    raf = requestAnimationFrame(frame);
  }

  function render(t) {
    if (!ctx2d) return;
    const dpr = ctx2d.__dpr || 1;
    setCssTransform();
    ctx2d.clearRect(0, 0, layout.vw, layout.vh);
    ctx2d.fillStyle = pal.bg;
    ctx2d.fillRect(0, 0, layout.vw, layout.vh);
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawCursor(t);
    drawParticles(t);
    // 外圈先画、内圈后画（内圈压在上面，接缝更自然）
    const order = petalGeo.order.slice().sort((a, b) => petalGeo.petals[b].rank - petalGeo.petals[a].rank);
    for (const i of order) drawPetal(i, t);
    drawWord(t);
    drawSweep(t);
    drawSubtitles(t);

    // 淡出
    const [f0, f1] = T.fadeOut;
    if (t > f0) {
      const a = clamp((t - f0) / (f1 - f0));
      if (host) host.style.opacity = String(1 - a);
    }
  }

  // ---- 覆盖层与控件 ----
  function buildHost() {
    host = document.createElement('div');
    host.setAttribute('data-pangu-intro', '');
    Object.assign(host.style, {
      position: 'fixed', inset: '0', zIndex: '2147483000',
      background: pal.bg, opacity: '1', transition: 'none',
      display: 'block', pointerEvents: 'auto',
    });
    canvas = document.createElement('canvas');
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
    host.appendChild(canvas);
    ctx2d = canvas.getContext('2d');

    // 底部右侧：跳过 / 不再自动播放
    controls = document.createElement('div');
    Object.assign(controls.style, {
      position: 'absolute', right: '20px', bottom: '18px', display: 'flex', gap: '8px',
      alignItems: 'center', font: '12px/1.4 "Segoe UI", "Microsoft YaHei UI", system-ui, sans-serif',
      color: pal.muted, opacity: '0', transition: 'opacity .35s ease',
    });
    const mkBtn = (label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      Object.assign(b.style, {
        appearance: 'none', border: `1px solid ${pal.chipLine}`, background: 'transparent',
        color: pal.chipText, font: 'inherit', padding: '5px 10px', borderRadius: '6px',
        cursor: 'pointer', opacity: '0.85', transition: 'background .15s ease, opacity .15s ease',
      });
      b.addEventListener('mouseenter', () => { b.style.background = pal.hover; b.style.opacity = '1'; });
      b.addEventListener('mouseleave', () => { b.style.background = 'transparent'; b.style.opacity = '0.85'; });
      return b;
    };
    const skipBtn = mkBtn('跳过');
    const neverBtn = mkBtn('不再自动播放');
    skipBtn.addEventListener('click', (e) => { e.stopPropagation(); requestSkip(); });
    neverBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try { await opts.onDisable?.(); } catch { /* 忽略 */ }
      requestSkip();
    });
    controls.appendChild(skipBtn);
    controls.appendChild(neverBtn);
    host.appendChild(controls);

    host.addEventListener('dblclick', requestSkip);
    requestAnimationFrame(() => { if (controls) controls.style.opacity = '1'; });
  }

  function onKey(ev) {
    if (ev.key === 'Escape' || ev.key === ' ' || ev.key === 'Enter') {
      ev.preventDefault();
      ev.stopPropagation();
      requestSkip();
    }
  }

  function requestSkip() {
    if (finished || skipRequested) return;
    skipRequested = true;
    if (isReduced()) { finish(); return; }
    // 立刻进入淡出
    const now = performance.now();
    const t = Math.max(now - startTs, 0);
    if (t >= T.fadeOut[0]) { finish(); return; }
    cancelAnimationFrame(raf);
    const from = t;
    const dur = 260;
    const tick = (ts) => {
      const p = clamp((ts - now) / dur);
      render(from + p * (T.fadeOut[0] - from) + p * 0.001);
      if (host) host.style.opacity = String(1 - p);
      if (p < 1) requestAnimationFrame(tick); else finish();
    };
    requestAnimationFrame(tick);
  }

  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey, true);
    if (host) {
      host.style.transition = 'opacity .18s ease';
      host.style.opacity = '0';
      const el = host;
      setTimeout(() => { try { el.remove(); } catch { /* 已移除 */ } }, 200);
    }
    try { opts.onDone?.(); } catch { /* 宿主回调异常不影响收尾 */ }
  }

  function resize() {
    if (!host || !ctx2d) return;
    layout = computeLayout();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    ctx2d.__dpr = dpr;
    canvas.width = Math.round(layout.vw * dpr);
    canvas.height = Math.round(layout.vh * dpr);
    canvas.style.width = `${layout.vw}px`;
    canvas.style.height = `${layout.vh}px`;
  }

  return {
    /** 挂载并开始播放。传 reduced=true 时只画终态。 */
    start() {
      if (host) return;
      buildHost();
      document.body.appendChild(host);
      resize();
      window.addEventListener('resize', resize);
      window.addEventListener('keydown', onKey, true);
      if (isReduced()) {
        render(T.subtitles[1]);
        setTimeout(finish, 900);
        return;
      }
      raf = requestAnimationFrame(frame);
    },
    skip: requestSkip,
    /** 预览/测试：按毫秒静态渲染一帧（不启动 rAF）。 */
    renderAt(t) {
      if (!host) {
        buildHost();
        document.body.appendChild(host);
        resize();
      }
      render(t);
    },
    destroy() {
      finished = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKey, true);
      if (host) host.remove();
      host = null;
    },
    get el() { return host; },
  };
}

if (typeof window !== 'undefined') window.createPangu = createPangu;

// 盘古 · 共享 UI 层：开屏播放、常驻小入口、开关面板。
// 宿主差异（配置从哪来、存到哪）由 adapter 提供：
//   adapter = {
//     brand: 'codex' | 'dsh',
//     strings: { slogan?, tagline, platform },
//     pixelSlogan: boolean,
//     load(): Promise<config>,          // { enabled, everyLaunch }
//     save(patch): Promise<config>,
//     disabled?: boolean,               // 启动参数强制关闭（Codex 启动器用）
//   }

const PANGU_STORE_KEY = 'pangu-theme.played';

function panguLuma(hex) {
  const h = String(hex).replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

/** 跟随宿主界面深浅：优先读页面背景色，读不到再看系统偏好。 */
function panguDetectTheme() {
  try {
    const bg = getComputedStyle(document.body).backgroundColor || '';
    const m = bg.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
    if (m) {
      const l = (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255;
      return l > 0.6 ? 'light' : 'dark';
    }
  } catch { /* 忽略 */ }
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/** 迷你花瓣图标：把 art.json 的多边形缩放到 20×20，不额外维护图标资源。 */
function panguChipIcon() {
  const lb = ART.logo_bbox;
  const w = lb[2] - lb[0], h = lb[3] - lb[1];
  const s = 20 / Math.max(w, h);
  const tx = (x) => ((x - lb[0] - (w - Math.max(w, h)) / 2) * s).toFixed(2);
  const ty = (y) => ((y - lb[1] - (h - Math.max(w, h)) / 2) * s).toFixed(2);
  const d = ART.petals.map((poly) => `M${poly.map(([x, y]) => `${tx(x)},${ty(y)}`).join('L')}Z`).join('');
  return `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><defs>
    <linearGradient id="pangu-chip-g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f29680"/><stop offset="0.55" stop-color="#d71718"/><stop offset="1" stop-color="#971e23"/>
    </linearGradient></defs><path d="${d}" fill="url(#pangu-chip-g)"/></svg>`;
}

function panguStyles() {
  if (document.getElementById('pangu-theme-style')) return;
  const style = document.createElement('style');
  style.id = 'pangu-theme-style';
  style.textContent = `
  [data-pangu-chip]{position:fixed;z-index:2147483000;width:28px;height:28px;border-radius:50%;
    display:grid;place-items:center;cursor:grab;opacity:.32;transition:opacity .18s ease,transform .18s ease,background .18s ease;
    border:1px solid rgba(255,255,255,.14);background:rgba(20,21,25,.66);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
    touch-action:none;user-select:none}
  [data-pangu-chip]:hover{opacity:1;transform:scale(1.06)}
  [data-pangu-chip]:active{cursor:grabbing}
  [data-pangu-chip][data-light]{border-color:rgba(0,0,0,.14);background:rgba(255,255,255,.8)}
  [data-pangu-panel]{position:fixed;z-index:2147483001;width:250px;border-radius:12px;padding:12px 12px 10px;
    background:rgba(22,23,28,.97);color:#e9e4df;font:12px/1.5 "Segoe UI","Microsoft YaHei UI",system-ui,sans-serif;
    border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 48px rgba(0,0,0,.45);backdrop-filter:blur(10px);}
  [data-pangu-panel][data-light]{background:rgba(252,252,252,.98);color:#262223;border-color:rgba(0,0,0,.12);box-shadow:0 18px 48px rgba(0,0,0,.18)}
  [data-pangu-panel] h4{margin:0 0 10px;font-size:12.5px;font-weight:600;letter-spacing:.02em;display:flex;align-items:center;gap:7px}
  [data-pangu-panel] h4 span.dot{width:7px;height:7px;border-radius:50%;background:#d71718;box-shadow:0 0 8px rgba(215,23,24,.8)}
  [data-pangu-panel] .row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:5px 0}
  [data-pangu-panel] .row small{opacity:.55;display:block;font-size:11px;line-height:1.35;margin-top:1px}
  [data-pangu-panel] button.act{appearance:none;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;
    padding:4px 9px;border-radius:6px;cursor:pointer;opacity:.75}
  [data-pangu-panel] button.act:hover{opacity:1}
  [data-pangu-panel] .switch{position:relative;width:34px;height:19px;border-radius:999px;background:rgba(255,255,255,.18);
    border:0;cursor:pointer;flex:0 0 auto;transition:background .18s ease;padding:0}
  [data-pangu-panel][data-light] .switch{background:rgba(0,0,0,.16)}
  [data-pangu-panel] .switch i{position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;background:#fff;
    transition:transform .18s ease;box-shadow:0 1px 3px rgba(0,0,0,.35)}
  [data-pangu-panel] .switch[aria-checked="true"]{background:#c7000b}
  [data-pangu-panel] .switch[aria-checked="true"] i{transform:translateX(15px)}
  [data-pangu-panel] .sep{height:1px;background:currentColor;opacity:.12;margin:7px 0}
  [data-pangu-panel] .foot{opacity:.45;font-size:10.5px;line-height:1.5}
  `;
  document.head.appendChild(style);
}

function panguCreateSwitch(checked, onChange) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'switch';
  btn.setAttribute('role', 'switch');
  btn.setAttribute('aria-checked', String(!!checked));
  btn.innerHTML = '<i></i>';
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('aria-checked') !== 'true';
    btn.setAttribute('aria-checked', String(next));
    onChange(next);
  });
  return btn;
}

/**
 * 装配开屏主题。返回 { boot() }，宿主在 DOM 就绪后调用一次即可。
 */
function createPanguTheme(adapter) {
  const state = {
    config: { enabled: true, everyLaunch: true },
    booted: false,
    intro: null,
    chip: null,
    panel: null,
    theme: panguDetectTheme(),
  };

  const sync = () => {
    const { chip, panel, config, theme } = state;
    if (chip) {
      if (theme === 'light') chip.setAttribute('data-light', '');
      else chip.removeAttribute('data-light');
      chip.title = config.enabled ? '盘古开屏动画：开（点击设置）' : '盘古开屏动画：关（点击设置）';
      chip.style.opacity = config.enabled ? '.34' : '.18';
    }
    if (panel) {
      if (theme === 'light') panel.setAttribute('data-light', '');
      else panel.removeAttribute('data-light');
      const en = panel.querySelector('[data-k="enabled"] .switch');
      if (en) en.setAttribute('aria-checked', String(config.enabled));
      const ev = panel.querySelector('[data-k="everyLaunch"] .switch');
      if (ev) ev.setAttribute('aria-checked', String(config.everyLaunch));
      panel.querySelectorAll('[data-k="everyLaunch"]').forEach((r) => {
        r.style.opacity = config.enabled ? '1' : '.4';
      });
    }
  };

  const save = async (patch) => {
    state.config = { ...state.config, ...patch };
    try {
      const cfg = await adapter.save(patch);
      if (cfg) state.config = { ...state.config, ...cfg };
    } catch (error) {
      console.warn('[pangu-theme] 保存配置失败：', error);
    }
    state.theme = panguDetectTheme();
    sync();
    return state.config;
  };

  const closePanel = () => {
    if (!state.panel) return;
    state.panel.remove();
    state.panel = null;
    document.removeEventListener('mousedown', outside, true);
  };

  function outside(ev) {
    const p = state.panel;
    if (!p) return;
    if (p.contains(ev.target) || (state.chip && state.chip.contains(ev.target))) return;
    closePanel();
  }

  const openPanel = () => {
    if (state.panel) return;
    panguStyles();
    const panel = document.createElement('div');
    panel.setAttribute('data-pangu-panel', '');
    panel.style.visibility = 'hidden';

    const title = document.createElement('h4');
    title.innerHTML = '<span class="dot"></span>盘古 · 开屏动画';
    panel.appendChild(title);

    const mkRow = (key, label, hint, checked, onChange) => {
      const row = document.createElement('div');
      row.className = 'row';
      row.setAttribute('data-k', key);
      const text = document.createElement('div');
      text.innerHTML = `${label}${hint ? `<small>${hint}</small>` : ''}`;
      row.appendChild(text);
      row.appendChild(panguCreateSwitch(checked, onChange));
      panel.appendChild(row);
    };

    mkRow('enabled', '开屏动画', '启动时播放花瓣开屏', state.config.enabled, (v) => save({ enabled: v }));
    mkRow('everyLaunch', '每次启动都播放', '关掉后只播一次', state.config.everyLaunch, (v) => save({ everyLaunch: v }));

    const sep = document.createElement('div');
    sep.className = 'sep';
    panel.appendChild(sep);

    const row = document.createElement('div');
    row.className = 'row';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'act';
    btn.textContent = '立即播放一次';
    btn.addEventListener('click', () => play(true));
    row.appendChild(btn);
    const foot = document.createElement('div');
    foot.className = 'foot';
    foot.textContent = 'ESC / 空格 跳过';
    row.appendChild(foot);
    panel.appendChild(row);

    document.body.appendChild(panel);
    state.panel = panel;
    // 贴着小花放：优先在上方，放不下就落到下方；左右夹在视口内
    const r = state.chip ? state.chip.getBoundingClientRect() : { left: 14, top: innerHeight - 70, right: 42, bottom: innerHeight - 42 };
    const pw = panel.offsetWidth || 250;
    const ph = panel.offsetHeight || 190;
    let left = Math.round(r.left);
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    left = Math.max(8, left);
    let top = Math.round(r.top - ph - 10);
    if (top < 8) top = Math.min(window.innerHeight - ph - 8, Math.round(r.bottom + 10));
    panel.style.left = `${left}px`;
    panel.style.top = `${Math.max(8, top)}px`;
    panel.style.visibility = '';
    sync();
    setTimeout(() => document.addEventListener('mousedown', outside, true), 0);
  };

  const CHIP_POS_KEY = 'pangu-theme.chip';

  const clampChip = (left, top) => {
    const w = state.chip ? state.chip.offsetWidth || 28 : 28;
    const h = state.chip ? state.chip.offsetHeight || 28 : 28;
    return {
      left: Math.min(Math.max(4, left), Math.max(4, window.innerWidth - w - 4)),
      top: Math.min(Math.max(4, top), Math.max(4, window.innerHeight - h - 4)),
    };
  };

  const placeChip = (left, top) => {
    const pos = clampChip(left, top);
    state.chip.style.left = `${pos.left}px`;
    state.chip.style.top = `${pos.top}px`;
    return pos;
  };

  const defaultChipPos = () => {
    const right = adapter.corner === 'right';
    const x = right ? window.innerWidth - 28 - 14 : 14;
    const y = window.innerHeight - 28 - 14;
    return { left: x, top: y };
  };

  const mountChip = () => {
    if (state.chip) return;
    panguStyles();
    const chip = document.createElement('div');
    chip.setAttribute('data-pangu-chip', '');
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.title = '盘古 · 点按开关，可拖动';
    chip.innerHTML = panguChipIcon();

    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(CHIP_POS_KEY) || 'null'); } catch { /* 忽略 */ }
    state.chip = chip;
    document.body.appendChild(chip);
    const start = saved && Number.isFinite(saved.left) && Number.isFinite(saved.top) ? saved : defaultChipPos();
    placeChip(start.left, start.top);

    // 拖动 / 点击二选一：位移超过 4px 视为拖动，松开后不打开面板
    let drag = null;
    let lastDragEnd = 0;
    chip.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0) return;
      const rect = chip.getBoundingClientRect();
      drag = { x: ev.clientX, y: ev.clientY, left: rect.left, top: rect.top, moved: false };
      chip.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });
    chip.addEventListener('pointermove', (ev) => {
      if (!drag) return;
      const dx = ev.clientX - drag.x;
      const dy = ev.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      drag.moved = true;
      placeChip(drag.left + dx, drag.top + dy);
    });
    chip.addEventListener('pointerup', () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      if (moved) {
        lastDragEnd = Date.now();
        try {
          localStorage.setItem(CHIP_POS_KEY, JSON.stringify({ left: parseFloat(chip.style.left), top: parseFloat(chip.style.top) }));
        } catch { /* 忽略 */ }
      }
    });
    chip.addEventListener('pointercancel', () => { drag = null; });
    // 保留原生 click：无障碍工具（以及测试脚本的 .click()）走的都是这条
    chip.addEventListener('click', () => {
      if (Date.now() - lastDragEnd < 400) return; // 刚拖完，别把拖动当点击
      if (state.panel) closePanel();
      else openPanel();
    });
    chip.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        if (state.panel) closePanel();
        else openPanel();
      }
    });

    window.addEventListener('resize', () => {
      placeChip(parseFloat(chip.style.left) || 14, parseFloat(chip.style.top) || 14);
      if (state.panel) { closePanel(); }
    });

    sync();
  };

  const play = (force) => {
    if (state.intro) return;
    if (!force) {
      if (adapter.disabled || !state.config.enabled) return;
      if (!state.everyLaunch) {
        let played = false;
        try { played = sessionStorage.getItem(PANGU_STORE_KEY) === '1'; } catch { /* 忽略 */ }
        if (played) return;
      }
      // 30 秒冷静期：应用内刷新 / 插件热重载不应该再放一遍
      try {
        const last = Number(sessionStorage.getItem(`${PANGU_STORE_KEY}.at`) || 0);
        if (last && Date.now() - last < 30000) return;
      } catch { /* 忽略 */ }
    }
    state.theme = panguDetectTheme();
    const intro = createPangu({
      brand: adapter.brand,
      theme: state.theme,
      pixelSlogan: adapter.pixelSlogan,
      strings: adapter.strings,
      onDisable: () => save({ enabled: false }),
      onDone: () => {
        state.intro = null;
        try {
          sessionStorage.setItem(PANGU_STORE_KEY, '1');
          sessionStorage.setItem(`${PANGU_STORE_KEY}.at`, String(Date.now()));
        } catch { /* 忽略 */ }
        if (state.chip) state.chip.style.display = '';
        sync();
      },
    });
    state.intro = intro;
    if (state.chip) state.chip.style.display = 'none';
    closePanel();
    intro.start();
  };

  return {
    async boot() {
      if (state.booted) return;
      state.booted = true;
      // 模块可能被 HMR/重复加载多次，用全局标记保证只挂一份
      if (window.__PANGU_THEME_ACTIVE__) return;
      window.__PANGU_THEME_ACTIVE__ = true;
      try {
        const cfg = await adapter.load();
        if (cfg) state.config = { ...state.config, ...cfg };
      } catch (error) {
        console.warn('[pangu-theme] 读取配置失败，用默认值：', error);
      }
      state.theme = panguDetectTheme();
      const start = () => { mountChip(); play(false); };
      if (document.body) start();
      else document.addEventListener('DOMContentLoaded', start, { once: true });
    },
    play,
    get config() { return state.config; },
  };
}

// 盘古开屏 · Codex / ChatGPT 桌面版入口。
// 由启动器通过 CDP 注入；配置存 localStorage（与应用同源，跨启动保留）。
const PANGU_CONFIG_KEY = 'pangu-theme.config';

const panguAdapter = {
  brand: 'codex',
  pixelSlogan: true,
  corner: 'right',
  strings: {
    tagline: 'CODE IT POSSIBLE',
    platform: '盘古大模型 · Codex',
  },
  disabled: typeof window !== 'undefined' && window.__PANGU_DISABLED__ === true,
  async load() {
    try {
      const raw = localStorage.getItem(PANGU_CONFIG_KEY);
      if (raw) {
        const cfg = JSON.parse(raw);
        if (cfg && typeof cfg === 'object') return cfg;
      }
    } catch { /* 忽略损坏数据 */ }
    return { enabled: true, everyLaunch: true };
  },
  async save(patch) {
    const next = { ...(await panguAdapter.load()), ...patch };
    try {
      localStorage.setItem(PANGU_CONFIG_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('[pangu-theme] 写入 localStorage 失败：', error);
    }
    return next;
  },
};

const panguTheme = createPanguTheme(panguAdapter);
panguTheme.boot();

})();

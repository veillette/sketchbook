// Fifty original mini-lessons. Each row adds one continuous stroke or closed shape.
const O = (x,y,rx,ry=rx) => `M ${x-rx} ${y} a ${rx} ${ry} 0 1 0 ${rx*2} 0 a ${rx} ${ry} 0 1 0 ${-rx*2} 0`;
const eye = (x,y) => O(x,y,3,5);
const face = (x,y,gap=22) => [
  ['Add the left eye.',eye(x-gap,y)], ['Add the right eye.',eye(x+gap,y)],
  ['Give it a gentle smile.',`M ${x-12} ${y+18} Q ${x} ${y+31} ${x+12} ${y+18}`],
];
const items = [];
function add(id,name,noun,category,intro,rows) {
  const colors=['peach','butter','lilac','sage','pink','blue'];
  items.push({id,name,noun,category,intro,color:colors[items.length%colors.length],steps:rows.map(([instruction,path,tip])=>({
    instruction,path,tip:tip ?? (path.includes(' a ') ? 'Go slowly around the oval; a slightly wobbly shape is fine.' : /Z$/i.test(path) ? 'Bring the last line back to where you started.' : /[QC]/.test(path) ? 'Use a relaxed, sweeping curve. It does not need to be perfectly even.' : 'Use short, clear lines and leave a little space around the details.'),
  }))});
}
add('bunny','Bouncy bunny','bunny','Animals','Two tall ears and a round little face.',[
 ['Draw a long left ear.','M 131 116 C 78 29 151 27 148 112'],
 ['Add a tall right ear.','M 172 112 C 169 27 242 29 189 116'],
 ['Curve around the head.','M 131 116 C 64 150 99 210 160 208 C 221 210 256 150 189 116'],
 ['Add a little oval nose.',O(160,173,7,5)], ...face(160,150),
 ['Draw a rounded body.','M 128 204 Q 102 239 119 268 L 201 268 Q 218 239 192 204'],
 ['Add a round fluffy tail.',O(218,250,12)], ['Separate the two paws.','M 160 246 L 160 268'],
]);
add('bear','Cuddly bear','bear','Animals','Round ears and a soft oval muzzle.',[
 ['Draw a round head.',O(160,133,63,60)], ['Add a left round ear.','M 106 103 C 64 69 110 39 129 77'],
 ['Add the right ear.','M 191 77 C 210 39 256 69 214 103'], ['Draw an oval muzzle.',O(160,155,27,21)],
 ['Add a little nose.',O(160,148,8,5)], ...face(160,122,25),
 ['Draw the body.','M 129 189 Q 94 237 118 268 L 202 268 Q 226 237 191 189'], ['Divide the feet.','M 160 251 L 160 268'],
]);
add('fox','Woodland fox','fox','Animals','Pointy ears and a big sweeping tail.',[
 ['Draw a pointed left ear.','M 101 117 L 89 55 L 141 98'], ['Draw the other ear.','M 179 98 L 231 55 L 219 117'],
 ['Join the top of the head.','M 141 98 Q 160 90 179 98'], ['Draw the pointed cheeks.','M 101 117 L 83 145 L 160 197 L 237 145 L 219 117'],
 ['Add a little nose.',O(160,184,6,4)], ['Draw the left eye.',eye(130,137)], ['Draw the right eye.',eye(190,137)],
 ['Draw a small body.','M 139 185 L 121 266 L 193 266 L 181 185'],
 ['Draw a large, pointed tail.','M 193 251 C 277 269 273 186 253 171 Q 249 223 193 228'],
 ['Mark the tail tip.','M 251 202 L 260 211 L 247 220'],
]);
add('owl','Sleepy owl','owl','Animals','A little owl with big round spectacles.',[
 ['Start with a plump outline.','M 101 103 L 94 71 L 130 89 Q 160 77 190 89 L 226 71 L 219 103 C 265 233 55 233 101 103 Z'],
 ['Draw the left eye ring.',O(133,127,26)], ['Add the right eye ring.',O(187,127,26)],
 ['Close the left eye.','M 121 129 Q 133 117 145 129'], ['Close the right eye.','M 175 129 Q 187 117 199 129'],
 ['Add a tiny beak.','M 151 153 L 160 167 L 169 153 Z'],
 ['Draw a left wing.','M 104 153 Q 106 182 128 190'], ['Draw a right wing.','M 216 153 Q 214 182 192 190'],
 ['Add one foot.','M 136 210 L 136 226 L 125 226'], ['Add the other foot.','M 184 210 L 184 226 L 195 226'],
]);
add('fish','Little fish','fish','Animals','A round swimmer with a triangular tail.',[
 ['Start with an oval body.',O(143,157,72,48)], ['Add the triangular tail.','M 213 157 L 264 115 L 264 199 Z'],
 ['Draw a top fin.','M 122 111 L 156 76 L 175 114'], ['Add a bottom fin.','M 127 204 L 158 234 L 175 202'],
 ['Draw a round eye.',O(110,146,5)], ['Add a smile.','M 83 166 Q 96 181 111 168'],
 ['Draw a curved gill.','M 139 131 Q 155 157 139 183'], ['Blow a round bubble.',O(74,99,10)],
]);
add('whale','Waving whale','whale','Animals','A big friendly swimmer with a splash on top.',[
 ['Draw the rounded body.','M 229 151 C 213 67 73 80 66 164 C 59 253 218 251 239 185'],
 ['Add a two-pointed tail.','M 229 151 Q 244 152 259 133 L 257 158 L 279 164 Q 262 190 239 185'],
 ['Draw a flipper.','M 147 198 Q 158 239 188 230 L 173 195'], ['Add a small eye.',eye(102,161)],
 ['Draw a wide smile.','M 70 181 Q 100 207 124 186'], ['Draw a spout.','M 149 92 L 149 63'],
 ['Add a left splash.','M 149 66 Q 127 35 119 61'], ['Add a right splash.','M 149 66 Q 171 35 179 61'],
]);
add('turtle','Slow turtle','turtle','Animals','A domed shell and four short little legs.',[
 ['Draw a domed shell.','M 91 183 C 83 67 237 67 229 183 Z'], ['Draw a round head.',O(254,166,24,22)],
 ['Add a front leg.','M 202 183 L 210 218 L 227 218 L 222 183'], ['Add a back leg.','M 100 183 L 93 218 L 110 218 L 119 183'],
 ['Draw a small pointed tail.','M 91 173 L 63 185 L 92 183'], ['Draw the eye.',eye(261,161)],
 ['Add a smile.','M 263 177 Q 271 182 276 173'], ['Draw the shell center.',O(160,148,24,29)],
 ['Connect the shell to the top.','M 160 119 L 160 99'], ['Connect it to the bottom.','M 160 177 L 160 183'],
 ['Connect the left shell panel.','M 136 148 L 95 148'], ['Connect the right panel.','M 184 148 L 225 148'],
]);
add('snail','Garden snail','snail','Animals','A curly shell and two curious feelers.',[
 ['Draw the long body.','M 72 207 Q 143 193 229 197 L 229 159 Q 229 145 243 145 Q 257 145 257 159 L 257 210 Q 160 235 72 218 Z'],
 ['Draw a large round shell.',O(157,153,51)], ['Curl a spiral inside.','M 158 190 C 97 182 115 111 159 121 C 197 130 183 174 155 166 Q 136 160 151 147'],
 ['Draw the left feeler.','M 235 145 L 225 123'], ['Draw the right feeler.','M 250 146 L 263 122'],
 ['Add a left eye.',O(223,119,5)], ['Add a right eye.',O(265,118,5)], ['Give the snail a smile.','M 237 174 Q 244 183 251 174'],
]);
add('butterfly','Dancing butterfly','butterfly','Animals','Four soft wings and two curly antennae.',[
 ['Draw a narrow body.',O(160,162,10,48)], ['Draw the upper left wing.','M 151 146 C 57 43 52 187 150 169'],
 ['Draw the upper right wing.','M 169 146 C 263 43 268 187 170 169'],
 ['Add the lower left wing.','M 150 174 C 61 160 111 262 155 193'], ['Add the lower right wing.','M 170 174 C 259 160 209 262 165 193'],
 ['Draw a left antenna.','M 156 115 Q 128 80 139 76'], ['Draw a right antenna.','M 164 115 Q 192 80 181 76'],
 ['Decorate the left wing.',O(111,138,13,18)], ['Decorate the right wing.',O(209,138,13,18)],
]);
add('bee','Busy bee','bee','Animals','A striped oval with two little wings.',[
 ['Start with the oval body.',O(160,172,68,43)], ['Draw a left wing.','M 133 133 C 65 52 163 51 155 128'],
 ['Add a right wing.','M 165 128 C 157 51 255 52 187 133'], ['Add the first stripe.','M 147 131 Q 132 173 147 213'],
 ['Add another stripe.','M 173 131 Q 158 173 173 213'], ['Draw the eye.',eye(113,162)],
 ['Give the bee a smile.','M 102 180 Q 114 192 125 180'], ['Add a pointed stinger.','M 225 161 L 246 173 L 225 183'],
 ['Draw a short antenna.','M 110 143 Q 92 115 86 125'],
]);
add('ladybug','Lucky ladybug','ladybug','Animals','A round shell dotted with big chalk spots.',[
 ['Draw a round shell.',O(160,173,64,68)], ['Add a little head.','M 126 115 C 119 62 201 62 194 115'],
 ['Divide the wings.','M 160 105 L 160 241'], ['Draw a left feeler.','M 140 81 L 129 62'],
 ['Add the right feeler.','M 180 81 L 191 62'], ['Add a left spot.',O(129,155,12)],
 ['Add a right spot.',O(191,155,12)], ['Add a lower left spot.',O(135,203,10)], ['Add a lower right spot.',O(185,203,10)],
]);
add('penguin','Waddling penguin','penguin','Animals','A round belly and two flat little feet.',[
 ['Draw a tall oval body.',O(160,162,62,93)], ['Draw an oval belly.',O(160,190,39,53)],
 ['Add a left flipper.','M 103 135 Q 64 187 97 207 L 112 177'], ['Add a right flipper.','M 217 135 Q 256 187 223 207 L 208 177'],
 ['Draw the left eye.',eye(139,119)], ['Draw the right eye.',eye(181,119)],
 ['Add a triangular beak.','M 150 140 L 170 140 L 160 154 Z'], ['Draw the left foot.','M 136 249 L 114 267 L 150 267 L 150 253'],
 ['Draw the right foot.','M 184 249 L 206 267 L 170 267 L 170 253'],
]);
add('chick','Spring chick','chick','Animals','An egg-shaped body with a tiny tuft.',[
 ['Start with a plump egg shape.',O(160,164,68,74)], ['Add a little tuft.','M 151 90 Q 142 64 158 77 Q 169 54 172 91'],
 ...face(160,147,23).slice(0,2), ['Draw a small beak.','M 151 166 L 169 166 L 160 178 Z'],
 ['Draw a curved wing.','M 111 177 Q 130 202 140 179'], ['Add a left leg.','M 139 235 L 139 260 L 127 260'],
 ['Add a right leg.','M 181 235 L 181 260 L 193 260'],
]);
add('frog','Pond frog','frog','Animals','Big round eyes and a smile across the pond.',[
 ['Draw a wide oval head.',O(160,161,79,51)], ['Add a left eye bump.','M 100 129 C 86 76 151 73 147 111'],
 ['Add the right eye bump.','M 173 111 C 169 73 234 76 220 129'], ['Draw the left eye.',eye(121,108)],
 ['Draw the right eye.',eye(199,108)], ['Add a big smile.','M 110 165 Q 160 211 210 165'],
 ['Draw a left back foot.','M 119 204 Q 63 229 101 249 L 141 249'], ['Draw a right back foot.','M 201 204 Q 257 229 219 249 L 179 249'],
 ['Add the front legs.','M 141 211 L 141 255 L 179 255 L 179 211'],
]);
add('pig','Rosy pig','pig','Animals','A big round snout and two floppy ears.',[
 ['Draw the round face.',O(160,155,72,70)], ['Add a left ear.','M 105 111 L 90 65 L 139 89'],
 ['Add a right ear.','M 181 89 L 230 65 L 215 111'], ['Draw an oval snout.',O(160,177,32,23)],
 ['Add one nostril.',O(148,177,4,6)], ['Add the other nostril.',O(172,177,4,6)],
 ['Draw the left eye.',eye(131,140)], ['Draw the right eye.',eye(189,140)],
 ['Add a small body.','M 127 218 L 117 269 L 203 269 L 193 218'], ['Separate the feet.','M 160 246 L 160 269'],
]);
add('mouse','Tiny mouse','mouse','Animals','Round ears, a small nose, and a long tail.',[
 ['Draw a left round ear.',O(111,96,32)], ['Draw the other ear.',O(209,96,32)],
 ['Draw a pointed face.','M 126 106 Q 160 82 194 106 Q 226 162 160 205 Q 94 162 126 106 Z'],
 ['Add the nose.',O(160,196,6,4)], ['Draw the left eye.',eye(140,143)], ['Draw the right eye.',eye(180,143)],
 ['Draw a small body.','M 143 195 Q 118 234 130 263 L 190 263 Q 202 234 177 195'],
 ['Give the mouse a curling tail.','M 191 250 C 257 281 275 215 243 228'], ['Add a whisker.','M 142 180 L 103 171'],
 ['Add the opposite whisker.','M 178 180 L 217 171'],
]);
add('lion','Brave little lion','lion','Animals','A big wavy mane around a friendly face.',[
 ['Draw a wavy mane.','M 160 63 Q 185 46 198 75 Q 236 59 238 98 Q 278 103 251 139 Q 279 169 245 187 Q 254 225 213 224 Q 192 259 160 236 Q 128 259 107 224 Q 66 225 75 187 Q 41 169 69 139 Q 42 103 82 98 Q 84 59 122 75 Q 135 46 160 63 Z'],
 ['Draw a round face.',O(160,151,58)], ...face(160,137,23), ['Add a triangular nose.','M 151 152 L 169 152 L 160 164 Z'],
 ['Draw a small left ear.',O(108,111,11)], ['Draw a right ear.',O(212,111,11)],
]);
add('octopus','Wiggly octopus','octopus','Animals','A round head with eight looping arms.',[
 ['Draw the domed head.','M 99 172 C 73 52 247 52 221 172'],
 ['Draw the left outer arm.','M 99 172 Q 56 160 58 187 Q 61 209 92 193'],
 ['Add the next left arm.','M 92 193 Q 55 229 83 239 Q 105 245 112 214'],
 ['Add a lower left arm.','M 112 214 Q 95 266 123 264 Q 142 262 139 226'],
 ['Draw the middle-left arm.','M 139 226 Q 132 277 155 272 L 160 233'],
 ['Draw the middle-right arm.','M 160 233 L 165 272 Q 188 277 181 226'],
 ['Add a lower right arm.','M 181 226 Q 178 262 197 264 Q 225 266 208 214'],
 ['Add the next right arm.','M 208 214 Q 215 245 237 239 Q 265 229 228 193'],
 ['Finish the right outer arm.','M 228 193 Q 259 209 262 187 Q 264 160 221 172'], ...face(160,140,25),
]);
add('jellyfish','Floating jellyfish','jellyfish','Animals','A soft umbrella shape and wavy tentacles.',[
 ['Draw a round umbrella top.','M 80 163 C 80 44 240 44 240 163'],
 ['Close it with little scallops.','M 80 163 Q 100 183 120 163 Q 140 183 160 163 Q 180 183 200 163 Q 220 183 240 163'],
 ['Draw a left tentacle.','M 110 174 C 88 202 128 221 108 256'], ['Add a middle-left tentacle.','M 143 174 C 122 205 165 230 143 273'],
 ['Add a middle-right tentacle.','M 177 174 C 156 205 199 230 177 273'], ['Draw the last tentacle.','M 210 174 C 188 202 228 221 208 256'], ...face(160,127,25),
]);
add('hedgehog','Shy hedgehog','hedgehog','Animals','A spiky back and a little pointed nose.',[
 ['Draw a zigzag back.','M 83 197 L 70 171 L 93 163 L 84 136 L 113 135 L 116 105 L 143 118 L 158 93 L 180 114 L 206 101 L 214 130 L 241 133 L 237 163'],
 ['Add the face and belly.','M 237 163 L 272 197 Q 246 221 83 214 L 83 197'],
 ['Draw the face boundary.','M 213 145 Q 186 181 218 219'], ['Add a nose.',O(270,195,5)],
 ['Draw the eye.',eye(236,180)], ['Add a small smile.','M 244 206 Q 253 209 257 202'],
 ['Add the first foot.','M 113 215 L 113 232 L 131 232'], ['Add a second foot.','M 201 218 L 201 232 L 219 232'],
]);
add('tree','Round little tree','tree','Plants','A cloud of leaves on a sturdy trunk.',[
 ['Draw the leafy crown.','M 125 181 C 64 193 61 126 95 117 C 71 71 134 49 158 77 C 191 42 249 79 224 116 C 267 134 238 194 194 181'],
 ['Draw the left trunk edge.','M 144 163 L 137 261'], ['Draw the right trunk edge.','M 176 163 L 183 261'],
 ['Join the roots.','M 137 261 Q 160 270 183 261'], ['Draw a left branch.','M 144 197 L 118 165'],
 ['Draw the right branch.','M 176 186 L 197 153'], ['Add a small knot.',O(159,226,6,10)],
 ['Add the ground.','M 92 267 Q 160 258 228 267'],
]);
add('mushroom','Woodland mushroom','mushroom','Plants','A big umbrella cap with round spots.',[
 ['Draw a wide mushroom cap.','M 67 163 Q 160 26 253 163 Z'],
 ['Draw a thick stem.','M 140 164 L 126 252 Q 160 267 194 252 L 180 164'],
 ['Add a spot near the top.',O(159,111,13)], ['Add a left spot.',O(111,143,10)], ['Add a right spot.',O(206,143,10)],
 ['Draw a small stem detail.','M 152 203 L 149 241'], ['Add a grass blade.','M 100 264 L 89 242 L 89 266'],
 ['Add a second blade.','M 216 264 L 229 240 L 228 267'],
]);
add('tulip','Spring tulip','tulip','Plants','A three-pointed flower and two long leaves.',[
 ['Draw a cup-shaped flower.','M 105 106 L 118 68 L 145 96 L 160 61 L 175 96 L 202 68 L 215 106 Q 215 166 160 166 Q 105 166 105 106 Z'],
 ['Draw a long stem.','M 160 166 L 160 274'], ['Add a left leaf.','M 160 236 Q 100 231 91 181 Q 145 185 160 236 Z'],
 ['Add a right leaf.','M 160 258 Q 220 253 229 203 Q 175 207 160 258 Z'],
 ['Mark a left petal fold.','M 145 96 Q 133 120 141 145'], ['Mark a right fold.','M 175 96 Q 187 120 179 145'],
 ['Add a left leaf vein.','M 160 236 L 111 199'], ['Add a right vein.','M 160 258 L 209 221'],
]);
add('sunflower','Big sunflower','sunflower','Plants','A sunny ring of pointed petals.',[
 ['Draw the center.',O(160,128,32)],
 ['Add the top petals.','M 137 105 L 137 72 L 160 95 L 183 72 L 183 105'],
 ['Draw the right petals.','M 183 105 L 218 103 L 192 128 L 218 153 L 183 151'],
 ['Draw the bottom petals.','M 183 151 L 183 184 L 160 161 L 137 184 L 137 151'],
 ['Draw the left petals.','M 137 151 L 102 153 L 128 128 L 102 103 L 137 105'],
 ['Add the stem.','M 160 184 L 160 276'], ['Add a leaf.','M 160 247 Q 111 243 106 208 Q 149 212 160 247 Z'],
 ['Draw a few seeds.','M 146 125 L 153 134 L 162 122 L 173 132'],
]);
add('leaf','Little leaf','leaf','Plants','One pointed leaf with branching veins.',[
 ['Draw the left half.','M 159 256 Q 55 145 184 63'], ['Draw the right half.','M 184 63 Q 262 192 159 256'],
 ['Draw the middle vein.','M 148 276 Q 160 172 184 63'], ['Add a lower left vein.','M 163 227 L 131 198'],
 ['Add a lower right vein.','M 168 201 L 205 181'], ['Add an upper left vein.','M 172 175 L 137 145'],
 ['Add an upper right vein.','M 177 146 L 208 127'], ['Add the highest vein.','M 182 115 L 161 96'],
]);
add('acorn','Oak acorn','acorn','Plants','A round nut wearing a textured little hat.',[
 ['Start with an oval cap rim.',O(160,145,61,16)], ['Draw a domed cap.','M 99 145 Q 105 85 160 90 Q 215 85 221 145'],
 ['Draw the rounded nut.','M 112 154 Q 114 232 160 257 Q 206 232 208 154'], ['Draw a short stalk.','M 153 90 L 151 66 Q 161 58 168 66 L 167 90'],
 ['Add the first cap mark.','M 127 112 L 140 128'], ['Add another cap mark.','M 153 104 L 168 124'],
 ['Add the last cap mark.','M 180 111 L 193 129'], ['Curve a highlight on the nut.','M 137 181 Q 137 211 151 226'],
]);
add('strawberry','Sweet strawberry','strawberry','Plants','A heart-shaped berry dotted with seeds.',[
 ['Draw a soft pointed berry.','M 160 105 C 52 49 74 207 160 263 C 246 207 268 49 160 105 Z'],
 ['Draw the leafy top.','M 160 105 L 125 77 L 144 111 L 106 115 L 150 127 L 160 151 L 171 125 L 211 114 L 176 111 L 195 77 Z'],
 ['Add a short stem.','M 160 104 Q 158 76 176 62'], ['Add an upper left seed.','M 116 151 L 119 161'],
 ['Add an upper right seed.','M 201 151 L 198 161'], ['Add a middle seed.','M 158 169 L 158 179'],
 ['Add a lower left seed.','M 133 199 L 136 209'], ['Add a lower right seed.','M 186 199 L 183 209'],
 ['Add the bottom seed.','M 159 225 L 159 235'],
]);
add('carrot','Crunchy carrot','carrot','Plants','A long pointy carrot and a leafy crown.',[
 ['Draw the carrot outline.','M 128 116 Q 160 100 192 116 Q 185 218 160 274 Q 135 218 128 116 Z'],
 ['Draw a left leaf.','M 145 111 Q 95 81 117 58 Q 150 70 153 109'],
 ['Add a tall middle leaf.','M 153 109 Q 135 35 160 42 Q 185 35 167 109'],
 ['Add a right leaf.','M 167 109 Q 170 70 203 58 Q 225 81 175 111'],
 ['Mark the first carrot crease.','M 133 143 L 153 146'], ['Add another crease.','M 187 167 L 167 170'],
 ['Add a lower crease.','M 143 197 L 160 200'], ['Finish with a small crease.','M 171 230 L 159 233'],
]);
add('pumpkin','Round pumpkin','pumpkin','Plants','A plump pumpkin with curving ridges.',[
 ['Draw a rounded outline.','M 160 115 C 66 70 53 246 132 252 Q 160 265 188 252 C 267 246 254 70 160 115 Z'],
 ['Draw a short stem.','M 149 111 L 144 80 L 170 72 L 171 111'], ['Draw the left ridge.','M 145 115 Q 108 181 144 256'],
 ['Add the right ridge.','M 175 115 Q 212 181 176 256'], ['Draw the middle ridge.','M 160 118 L 160 260'],
 ['Add a curly vine.','M 172 91 C 209 63 231 92 211 103 Q 196 110 199 95'],
 ['Draw a small leaf.','M 190 84 Q 198 48 225 55 Q 224 83 190 84 Z'], ['Add a leaf vein.','M 190 84 L 214 62'],
]);
add('palm-tree','Island palm','palm tree','Plants','A leaning trunk and a crown of long leaves.',[
 ['Draw a curved trunk.','M 133 268 Q 164 189 159 132 L 176 132 Q 187 201 159 268 Z'],
 ['Draw the top-left leaf.','M 165 130 Q 105 125 83 69 Q 149 70 165 130 Z'],
 ['Add the top-right leaf.','M 165 130 Q 183 65 244 72 Q 222 123 165 130 Z'],
 ['Add a hanging left leaf.','M 165 130 Q 86 95 63 160 Q 109 132 165 130 Z'],
 ['Add a hanging right leaf.','M 165 130 Q 244 95 267 160 Q 221 132 165 130 Z'],
 ['Mark the upper trunk.','M 160 174 L 175 178'], ['Mark the lower trunk.','M 151 220 L 169 224'],
 ['Add an island curve.','M 79 277 Q 155 254 231 277'],
]);
add('ghost','Shy ghost','ghost','Characters','A soft floating shape with a scalloped hem.',[
 ['Draw a rounded ghost.','M 99 239 L 99 131 C 99 43 221 43 221 131 L 221 239'],
 ['Draw a wavy hem.','M 221 239 Q 201 210 180 239 Q 160 210 140 239 Q 119 210 99 239'], ...face(160,132,24),
 ['Add a left waving arm.','M 99 158 Q 65 128 65 156 Q 67 181 99 185'],
 ['Add a right arm.','M 221 158 Q 255 128 255 156 Q 253 181 221 185'],
 ['Add a floating swoosh.','M 120 271 Q 160 281 200 271'],
]);
add('robot','Hello robot','robot','Characters','A square head, buttons, and bendy arms.',[
 ['Draw a square head.','M 106 85 L 214 85 L 214 167 L 106 167 Z'], ['Add an antenna.','M 160 85 L 160 61'],
 ['Top it with a circle.',O(160,55,6)], ['Draw a left eye.',O(132,120,9)], ['Draw a right eye.',O(188,120,9)],
 ['Add a rectangular smile.','M 135 142 L 185 142 L 185 152 L 135 152 Z'],
 ['Draw a boxy body.','M 120 180 L 200 180 L 200 240 L 120 240 Z'],
 ['Draw a left arm.','M 120 190 L 91 190 L 91 222'], ['Add a right arm.','M 200 190 L 229 190 L 229 222'],
 ['Add a left leg.','M 139 240 L 139 269 L 122 269'], ['Add a right leg.','M 181 240 L 181 269 L 198 269'],
 ['Draw a round button.',O(160,209,9)],
]);
add('monster','Silly monster','monster','Characters','One big eye and a big friendly grin.',[
 ['Draw a lumpy body.','M 108 101 Q 86 69 104 63 L 139 85 Q 160 75 181 85 L 216 63 Q 234 69 212 101 C 266 182 218 244 160 242 C 102 244 54 182 108 101 Z'],
 ['Draw one big eye.',O(160,126,29)], ['Add its pupil.',O(160,126,9)],
 ['Draw a broad smile.','M 117 175 Q 160 224 203 175 Z'], ['Add a left tooth.','M 132 175 L 140 188 L 148 175'],
 ['Add a right tooth.','M 172 175 L 180 188 L 188 175'], ['Draw a left foot.','M 137 240 L 130 264 L 111 264'],
 ['Draw a right foot.','M 183 240 L 190 264 L 209 264'],
]);
add('alien','Space visitor','alien','Characters','A big head, oval eyes, and two antennae.',[
 ['Draw a large oval head.',O(160,139,76,59)], ['Add a left oval eye.',O(128,133,14,20)],
 ['Draw the right eye.',O(192,133,14,20)], ['Add a tiny smile.','M 147 168 Q 160 179 173 168'],
 ['Draw a left antenna.','M 124 87 L 113 64'], ['Add a right antenna.','M 196 87 L 207 64'],
 ['Draw a left antenna tip.',O(110,59,6)], ['Add the other tip.',O(210,59,6)],
 ['Draw a little body.','M 142 197 L 126 249 L 194 249 L 178 197'],
 ['Draw the left leg.','M 143 249 L 143 274 L 131 274'], ['Add the right leg.','M 177 249 L 177 274 L 189 274'],
]);
add('snowman','Snowy friend','snowman','Characters','Two snowballs, a hat, and a carrot nose.',[
 ['Draw a round body.',O(160,208,59,60)], ['Draw the head.',O(160,115,40)],
 ['Draw a hat brim.','M 105 84 L 215 84'], ['Add the hat top.','M 127 84 L 127 48 L 193 48 L 193 84'],
 ['Draw a left eye.',eye(146,110)], ['Add the right eye.',eye(174,110)], ['Draw a carrot nose.','M 155 124 L 192 130 L 155 136 Z'],
 ['Add a scarf.','M 123 151 L 198 151 L 198 165 L 176 165 L 176 195 L 160 195 L 160 165 L 123 165 Z'],
 ['Draw a left twig arm.','M 105 187 L 74 164 L 71 146'], ['Add the right arm.','M 215 187 L 246 164 L 249 146'],
 ['Add an upper button.',O(148,202,4)], ['Add a lower button.',O(148,230,4)],
]);
add('wizard','Little wizard','wizard','Characters','A pointed hat above a long flowing beard.',[
 ['Draw a tall pointed hat.','M 104 125 L 158 44 L 216 125 Z'], ['Add a wide brim.','M 86 127 Q 160 146 234 127'],
 ['Draw a rounded face.','M 121 137 Q 107 186 160 194 Q 213 186 199 137'], ...face(160,156,19).slice(0,2),
 ['Add a long pointed beard.','M 124 177 Q 115 220 160 266 Q 205 220 196 177'],
 ['Draw the nose.',O(160,179,8,6)], ['Add a star to the hat.','M 160 78 L 165 91 L 179 91 L 168 100 L 172 113 L 160 105 L 148 113 L 152 100 L 141 91 L 155 91 Z'],
 ['Draw a beard curl.','M 147 209 Q 140 233 156 243'],
]);
add('pirate','Little pirate','pirate','Characters','A captain with a big hat and an eye patch.',[
 ['Draw a round face.',O(160,158,57)], ['Draw the sweeping hat.','M 87 116 Q 92 90 118 99 Q 119 52 160 69 Q 201 52 202 99 Q 228 90 233 116 Z'],
 ['Add the hat emblem.',O(160,91,9)], ['Draw a round eye patch.',O(138,150,14)],
 ['Draw its strap.','M 106 132 L 124 143'], ['Add the uncovered eye.',eye(184,151)],
 ['Draw a smile.','M 143 181 Q 160 197 181 179'], ['Add a little body.','M 130 207 L 113 265 L 207 265 L 190 207'],
 ['Draw a shirt stripe.','M 123 231 L 197 231'], ['Add another stripe.','M 117 251 L 203 251'],
]);
add('mermaid','Sea mermaid','mermaid','Characters','A flowing tail and a face framed by waves.',[
 ['Draw a round face.',O(160,103,32)], ['Draw the left hair.','M 147 74 C 93 56 95 153 113 168'],
 ['Draw the right hair.','M 173 74 C 227 56 225 153 207 168'], ...face(160,98,12),
 ['Draw the body and curling tail.','M 145 135 Q 126 172 150 205 Q 167 229 208 228 L 200 210 Q 219 216 235 205 L 226 237 Q 153 266 130 207 Q 114 172 145 135 Z'],
 ['Draw the right shoulder and waist.','M 175 135 Q 192 166 169 189'], ['Add a tail scale.','M 148 209 Q 160 222 172 209'],
 ['Add another scale.','M 171 226 Q 183 238 194 226'],
]);
add('house','Little cottage','house','Objects','A triangle roof above a welcoming doorway.',[
 ['Draw the roof.','M 67 148 L 160 68 L 253 148 Z'], ['Draw the house walls.','M 89 148 L 89 266 L 231 266 L 231 148'],
 ['Draw the door.','M 143 266 L 143 201 Q 160 186 177 201 L 177 266'], ['Add a round doorknob.',O(167,231,3)],
 ['Draw a left window.','M 107 173 L 131 173 L 131 203 L 107 203 Z'], ['Draw a right window.','M 189 173 L 213 173 L 213 203 L 189 203 Z'],
 ['Add a chimney.','M 199 99 L 199 67 L 220 67 L 220 117'], ['Add a path.','M 143 267 L 128 282 L 192 282 L 177 267'],
]);
add('rocket','Moon rocket','rocket','Objects','A pointed rocket with a round window.',[
 ['Draw the rocket body.','M 127 215 L 127 133 Q 129 87 160 53 Q 191 87 193 133 L 193 215 Z'],
 ['Mark the nose cone.','M 133 114 L 187 114'], ['Add a round window.',O(160,151,19)],
 ['Draw a left fin.','M 127 167 L 99 223 L 127 209'], ['Add a right fin.','M 193 167 L 221 223 L 193 209'],
 ['Draw the engine nozzle.','M 143 215 L 138 231 L 182 231 L 177 215'],
 ['Add a long flame.','M 144 232 Q 132 253 160 281 Q 188 253 176 232'],
 ['Add a smaller inner flame.','M 151 239 Q 150 257 160 266 Q 170 257 169 239'],
]);
add('sailboat','Breezy sailboat','sailboat','Objects','Two triangle sails and a gently rocking hull.',[
 ['Draw the boat hull.','M 65 210 L 255 210 L 220 250 L 100 250 Z'], ['Draw the tall mast.','M 160 210 L 160 59'],
 ['Draw the left sail.','M 150 79 L 76 194 L 150 194 Z'], ['Add the right sail.','M 170 106 L 236 194 L 170 194 Z'],
 ['Fly a little flag.','M 160 59 L 190 59 L 160 78'], ['Add a round porthole.',O(127,228,6)],
 ['Add another porthole.',O(190,228,6)], ['Draw a wave underneath.','M 64 270 Q 88 256 112 270 Q 136 284 160 270 Q 184 256 208 270 Q 232 284 256 270'],
]);
add('hot-air-balloon','Up and away','hot-air balloon','Objects','A big striped balloon with a little basket.',[
 ['Draw the balloon outline.','M 138 219 C 25 96 110 40 160 54 C 210 40 295 96 182 219 Z'],
 ['Draw a left stripe.','M 151 56 C 107 96 127 176 146 218'], ['Add a right stripe.','M 169 56 C 213 96 193 176 174 218'],
 ['Draw the basket.','M 136 242 L 184 242 L 180 272 L 140 272 Z'],
 ['Add the left rope.','M 138 219 L 143 242'], ['Add the right rope.','M 182 219 L 177 242'],
 ['Draw a stripe on the basket.','M 139 253 L 182 253'], ['Add a second stripe.','M 140 263 L 181 263'],
]);
add('ice-cream','Scoopy ice cream','ice cream','Objects','A round scoop on a crunchy triangle cone.',[
 ['Draw the scoop.','M 94 156 C 75 62 245 62 226 156'], ['Close it with a wavy edge.','M 94 156 Q 111 171 127 156 Q 143 171 160 156 Q 177 171 193 156 Q 209 171 226 156'],
 ['Draw the cone.','M 108 164 L 160 278 L 212 164'], ['Add a diagonal waffle line.','M 117 185 L 188 218'],
 ['Add another diagonal.','M 129 212 L 177 243'], ['Cross the first waffle line.','M 201 185 L 133 218'],
 ['Cross the lower waffle line.','M 189 212 L 145 243'], ['Add a cherry.',O(160,81,12)],
 ['Draw the cherry stalk.','M 160 69 Q 162 49 176 45'],
]);
add('cupcake','Birthday cupcake','cupcake','Objects','Swirly frosting in a pleated paper case.',[
 ['Draw the cake wrapper.','M 101 179 L 118 262 L 202 262 L 219 179 Z'],
 ['Draw a frosting swirl.','M 97 178 C 70 158 105 142 119 147 C 92 116 136 103 142 114 C 128 94 161 78 172 101 C 197 91 221 117 201 137 C 243 140 243 176 219 179'],
 ['Draw a candle.','M 153 91 L 153 58 L 167 58 L 167 91'], ['Add a little flame.','M 160 52 Q 141 42 160 28 Q 179 42 160 52 Z'],
 ['Draw the first wrapper fold.','M 125 195 L 134 249'], ['Add a middle fold.','M 160 195 L 160 249'],
 ['Draw the last fold.','M 195 195 L 186 249'], ['Add a sprinkle.','M 132 153 L 145 158'], ['Add a second sprinkle.','M 184 150 L 191 143'],
]);
add('umbrella','Rainy-day umbrella','umbrella','Objects','A scalloped canopy and a hooked handle.',[
 ['Draw the umbrella dome.','M 61 157 Q 160 28 259 157'],
 ['Draw the scalloped edge.','M 61 157 Q 86 133 111 157 Q 135 133 160 157 Q 185 133 209 157 Q 234 133 259 157'],
 ['Draw the long handle.','M 160 157 L 160 252 Q 160 280 136 271 Q 122 266 129 253'],
 ['Add a left canopy rib.','M 160 61 Q 114 98 111 157'], ['Add a right canopy rib.','M 160 61 Q 206 98 209 157'],
 ['Draw a rain drop.','M 77 195 Q 60 220 77 222 Q 94 220 77 195 Z'],
 ['Add another drop.','M 238 186 Q 221 211 238 213 Q 255 211 238 186 Z'],
 ['Add a third drop.','M 212 237 Q 195 262 212 264 Q 229 262 212 237 Z'],
]);
add('rainbow','Rainbow day','rainbow','Nature','Three arches between fluffy little clouds.',[
 ['Draw the outside arch.','M 67 203 C 67 41 253 41 253 203'], ['Add the middle arch.','M 88 203 C 88 70 232 70 232 203'],
 ['Add the inside arch.','M 109 203 C 109 99 211 99 211 203'],
 ['Draw a cloud on the left.','M 61 235 C 30 233 35 202 56 201 C 44 173 90 171 92 194 C 119 187 128 232 102 235 Z'],
 ['Draw a cloud on the right.','M 218 235 C 192 232 201 187 228 194 C 230 171 276 173 264 201 C 285 202 290 233 259 235 Z'],
 ['Draw a small sunshine circle.',O(254,72,13)], ['Add a sun ray.','M 254 49 L 254 40'], ['Add another ray.','M 277 72 L 286 72'],
]);
add('sun','Hello sunshine','sun','Nature','A smiling circle surrounded by rays.',[
 ['Draw a big circle.',O(160,158,52)], ...face(160,148,19),
 ['Draw the top ray.','M 160 90 L 160 61'], ['Add the bottom ray.','M 160 226 L 160 255'],
 ['Draw the left ray.','M 92 158 L 63 158'], ['Add the right ray.','M 228 158 L 257 158'],
 ['Draw the upper left ray.','M 111 109 L 90 88'], ['Draw the upper right ray.','M 209 109 L 230 88'],
 ['Add the lower left ray.','M 111 207 L 90 228'], ['Add the lower right ray.','M 209 207 L 230 228'],
]);
add('moon','Sleepy moon','moon','Nature','A crescent moon and little twinkling stars.',[
 ['Draw the outer moon curve.','M 191 65 C 52 77 48 253 192 266'], ['Draw the inner curve.','M 192 266 C 109 200 122 116 191 65'],
 ['Draw a sleepy eye.','M 101 150 Q 113 140 125 150'], ['Add a little smile.','M 106 174 Q 117 184 128 173'],
 ['Add a large twinkle.','M 225 110 L 231 125 L 246 131 L 231 137 L 225 152 L 219 137 L 204 131 L 219 125 Z'],
 ['Add a smaller twinkle.','M 252 199 L 257 210 L 268 215 L 257 220 L 252 231 L 247 220 L 236 215 L 247 210 Z'],
 ['Draw a tiny star dot.',O(201,193,3)], ['Add another star dot.',O(259,75,3)],
]);
add('castle','Tiny castle','castle','Objects','Three towers and a door for storybook adventures.',[
 ['Draw the left tower.','M 77 264 L 77 124 L 117 124 L 117 264'], ['Add its roof.','M 67 124 L 97 73 L 127 124 Z'],
 ['Draw the right tower.','M 203 264 L 203 124 L 243 124 L 243 264'], ['Add the right roof.','M 193 124 L 223 73 L 253 124 Z'],
 ['Join the castle wall.','M 117 157 L 137 157 L 137 142 L 153 142 L 153 157 L 169 157 L 169 142 L 185 142 L 185 157 L 203 157'],
 ['Draw the bottom.','M 77 264 L 243 264'], ['Add an arched doorway.','M 143 264 L 143 218 Q 160 186 177 218 L 177 264'],
 ['Draw a left window.','M 89 171 L 89 151 Q 97 137 105 151 L 105 171 Z'], ['Draw the right window.','M 215 171 L 215 151 Q 223 137 231 151 L 231 171 Z'],
 ['Add a flag.','M 223 73 L 223 44 L 250 51 L 223 60'],
]);
add('train','Choo-choo train','train','Objects','A little engine with round wheels and a puff of steam.',[
 ['Draw the long engine base.','M 66 203 L 259 203 L 259 226 L 66 226 Z'],
 ['Add the tall cab.','M 180 203 L 180 119 L 246 119 L 246 203'], ['Draw a cab roof.','M 170 119 L 256 119'],
 ['Draw the front engine.','M 85 203 L 85 157 L 180 157'], ['Add a chimney.','M 107 157 L 107 124 L 130 124 L 130 157'],
 ['Draw a square window.','M 196 138 L 230 138 L 230 170 L 196 170 Z'],
 ['Draw the front wheel.',O(106,234,21)], ['Draw the back wheel.',O(219,234,21)], ['Join the wheels.','M 106 234 L 219 234'],
 ['Add a puff of steam.','M 118 101 C 91 103 96 73 113 78 C 107 57 143 57 141 77 C 167 71 166 105 144 101 Z'],
]);
export const extraLessons = items;

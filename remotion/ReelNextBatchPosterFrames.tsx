import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

type PosterProps = { sceneNumber: number };

const display = "Impact, 'Arial Narrow', 'Franklin Gothic Condensed', sans-serif";
const body = "Arial, 'Helvetica Neue', sans-serif";

function Photo({ src, style }: { src: string; style?: CSSProperties }) {
  return <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }} />;
}

function Brand({ color = '#fff' }: { color?: string }) {
  return <div style={{ position: 'absolute', left: 54, top: 52, zIndex: 30, color, font: `900 25px/1 ${body}`, letterSpacing: 4 }}>EPICKOR</div>;
}

function Kicker({ children, color = '#fff', background }: { children: ReactNode; color?: string; background?: string }) {
  return <div style={{ display: 'inline-block', color, background, padding: background ? '11px 15px 10px' : 0, font: `900 22px/1 ${body}`, letterSpacing: 4, textTransform: 'uppercase' }}>{children}</div>;
}

function Display({ children, color = 'inherit', size = 130, style }: { children: ReactNode; color?: string; size?: number; style?: CSSProperties }) {
  return <div style={{ color, font: `900 ${size}px/.88 ${display}`, letterSpacing: -2.8, textTransform: 'uppercase', ...style }}>{children}</div>;
}

function Grain({ opacity = 0.08 }: { opacity?: number }) {
  return <AbsoluteFill style={{ zIndex: 20, opacity, pointerEvents: 'none', mixBlendMode: 'overlay', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.8) 0 1px, transparent 1.4px)', backgroundSize: '11px 11px' }} />;
}

function Footer({ children, color = 'rgba(255,255,255,.72)' }: { children: ReactNode; color?: string }) {
  return <div style={{ position: 'absolute', left: 54, right: 54, bottom: 52, zIndex: 30, color, font: `900 18px/1 ${body}`, letterSpacing: 3.2, textTransform: 'uppercase' }}>{children}</div>;
}

const social = {
  cobalt: '#1557ff',
  red: '#ff3b30',
  ivory: '#f7f2e8',
  ink: '#111318',
  green: '#25b56a',
};

function SocialScene({ n }: { n: number }) {
  if (n === 1) return (
    <AbsoluteFill style={{ background: social.ink, color: social.ivory }}>
      <Photo src="assets/reels/301/design/scene-1.jpg" style={{ filter: 'saturate(.72) contrast(1.08) brightness(.67)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(17,19,24,.22), rgba(21,87,255,.18) 42%, rgba(17,19,24,.96) 88%)' }} />
      <Brand />
      <div style={{ position: 'absolute', left: 54, top: 210, zIndex: 18 }}><Kicker background={social.red}>Korean social rule</Kicker></div>
      <div style={{ position: 'absolute', left: 54, right: 54, top: 510, zIndex: 18 }}>
        <div style={{ font: `900 190px/.85 ${body}`, letterSpacing: -10, color: 'transparent', WebkitTextStroke: `5px ${social.ivory}` }}>아줌마</div>
        <Display size={171} style={{ marginTop: 32 }}>Don&apos;t say</Display>
        <Display size={206} color={social.red}>Ajumma</Display>
      </div>
      <div style={{ position: 'absolute', left: 54, right: 110, bottom: 160, zIndex: 18, borderTop: `3px solid ${social.cobalt}`, paddingTop: 25, font: `800 34px/1.18 ${body}` }}>It can look like “ma&apos;am” in subtitles<br/><span style={{ color: '#9eb8ff' }}>and still land wrong in real life.</span></div>
      <Footer>Seoul social decoder · 01</Footer><Grain />
    </AbsoluteFill>
  );

  if (n === 2) return (
    <AbsoluteFill style={{ background: social.ivory, color: social.ink }}>
      <div style={{ position: 'absolute', inset: '0 0 0 400px' }}><Photo src="assets/reels/301/design/scene-2.jpg" style={{ filter: 'saturate(.65) contrast(1.05)' }} /></div>
      <div style={{ position: 'absolute', inset: '0 680px 0 0', background: social.cobalt }} />
      <Brand />
      <div style={{ position: 'absolute', left: 54, top: 230, zIndex: 18, width: 540 }}>
        <Kicker color={social.ivory}>Subtitle mismatch</Kicker>
        <Display size={132} style={{ marginTop: 42 }}>“Ma&apos;am”?</Display>
        <div style={{ position: 'relative', marginTop: 15, display: 'inline-block', font: `900 110px/.9 ${display}`, textTransform: 'uppercase' }}>
          Not quite
          <div style={{ position: 'absolute', left: -12, right: -18, top: '52%', height: 13, background: social.red, transform: 'rotate(-4deg)' }} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 450, right: 54, bottom: 190, zIndex: 18, background: 'rgba(247,242,232,.93)', padding: '34px 32px', borderLeft: `12px solid ${social.red}` }}>
        <div style={{ font: `900 27px/1 ${body}`, letterSpacing: 3, color: social.red }}>WHAT KOREAN HEARS</div>
        <div style={{ font: `900 43px/1.12 ${body}`, marginTop: 18 }}>AGE + FAMILIARITY<br/>YOU MAY NOT HAVE</div>
      </div>
      <Footer color="rgba(255,255,255,.78)">Meaning is not permission</Footer>
    </AbsoluteFill>
  );

  if (n === 3) return (
    <AbsoluteFill style={{ background: social.ink, color: social.ivory }}>
      <Photo src="assets/images/posts/301/women-seoul-crosswalk.jpg" style={{ filter: 'saturate(.62) brightness(.58) contrast(1.06)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(17,19,24,.94), rgba(17,19,24,.18) 82%)' }} />
      <Brand />
      <div style={{ position: 'absolute', left: 54, top: 250, zIndex: 18 }}>
        <Kicker color="#9eb8ff">Three things arrive first</Kicker>
        <div style={{ marginTop: 52, display: 'grid', gap: 25 }}>
          {['01  AGE', '02  RELATIONSHIP', '03  SOCIAL POSITION'].map((x, i) => <div key={x} style={{ borderLeft: `10px solid ${[social.red, social.cobalt, social.ivory][i]}`, padding: '18px 25px', background: 'rgba(17,19,24,.62)', font: `900 48px/1 ${body}`, letterSpacing: 1.2 }}>{x}</div>)}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 54, right: 54, bottom: 190, zIndex: 18 }}>
        <Display size={111}>The translation</Display>
        <Display size={127} color={social.red}>is easy.</Display>
        <div style={{ marginTop: 27, font: `900 41px/1.1 ${body}` }}>The social distance is not.</div>
      </div>
      <Footer>Read the relationship · not the face</Footer><Grain />
    </AbsoluteFill>
  );

  if (n === 4) return (
    <AbsoluteFill style={{ background: social.cobalt, color: social.ivory }}>
      <Brand />
      <div style={{ position: 'absolute', left: 54, right: 54, top: 165, height: 800, overflow: 'hidden', border: `10px solid ${social.ivory}` }}><Photo src="assets/reels/301/design/scene-4.jpg" style={{ objectPosition: 'center 55%' }} /></div>
      <div style={{ position: 'absolute', left: 54, right: 54, top: 1040 }}>
        <Kicker color="#bcd0ff">Context can change it</Kicker>
        <Display size={119} style={{ marginTop: 31 }}>Not always</Display>
        <Display size={158} color={social.ivory}>an insult</Display>
        <div style={{ marginTop: 45, padding: '31px 34px', background: social.red, font: `900 42px/1.08 ${body}` }}>SELF-USE ≠ STRANGER PERMISSION</div>
      </div>
      <Footer>Warmth belongs to the relationship</Footer>
    </AbsoluteFill>
  );

  if (n === 5) return (
    <AbsoluteFill style={{ background: social.ink, color: social.ink }}>
      <Photo src="assets/reels/301/design/scene-5.jpg" style={{ filter: 'brightness(.42) saturate(.45) contrast(1.08)' }} />
      <AbsoluteFill style={{ background: 'rgba(21,87,255,.34)' }} />
      <Brand />
      <div style={{ position: 'absolute', left: 54, right: 54, top: 160, bottom: 195, zIndex: 18, background: 'rgba(247,242,232,.94)', padding: '46px 40px', boxSizing: 'border-box', border: '2px solid rgba(255,255,255,.65)', boxShadow: '0 30px 90px rgba(0,0,0,.3)' }}>
        <Kicker color={social.cobalt}>Social distance decoder</Kicker>
        <Display size={112} style={{ marginTop: 27 }}>Use the room</Display>
        <Display size={116} color={social.red}>not a phrasebook</Display>
        <div style={{ marginTop: 50, borderTop: `5px solid ${social.ink}` }}>
          {[
            ['STRANGER', 'JEOGIYO', social.green],
            ['KNOWN OWNER', 'SAJANGNIM', social.cobalt],
            ['CASUAL RESTAURANT', 'IMO — ONLY IF THE ROOM DOES', social.red],
          ].map(([a,b,c]) => <div key={a} style={{ minHeight: 250, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'center', borderBottom: '2px solid rgba(17,19,24,.2)', padding: '18px 0' }}><div style={{ font: `900 25px/1.12 ${body}`, letterSpacing: 2.1, color: '#656871' }}>{a}</div><div style={{ font: `900 39px/1.03 ${body}`, color: c }}>{b}</div></div>)}
        </div>
        <div style={{ position: 'absolute', left: 40, right: 40, bottom: 35, font: `900 23px/1.15 ${body}`, letterSpacing: 1.8, textAlign: 'center', color: '#656871' }}>WHEN YOU DON&apos;T KNOW THE RELATIONSHIP, DON&apos;T GUESS IT.</div>
      </div>
      <Grain />
    </AbsoluteFill>
  );

  if (n === 6) return (
    <AbsoluteFill style={{ background: social.ivory, color: social.ink }}>
      <div style={{ position: 'absolute', inset: '0 0 760px 0' }}><Photo src="assets/images/posts/301/market-women-seoul.jpg" style={{ objectPosition: 'center 38%', filter: 'saturate(.68)' }} /></div>
      <Brand />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 850, background: social.ivory, padding: '70px 54px 55px', boxSizing: 'border-box' }}>
        <Kicker color={social.green}>Safest first move</Kicker>
        <div style={{ marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 25, padding: '27px 31px', border: `7px solid ${social.green}` }}>
          <div style={{ width: 32, height: 32, borderRadius: 50, background: social.green }} />
          <div style={{ font: `900 108px/.86 ${display}`, color: social.green }}>JEOGIYO</div>
        </div>
        <Display size={102} style={{ marginTop: 54 }}>Get attention.</Display>
        <Display size={116} color={social.red}>Skip the age guess.</Display>
      </div>
      <Footer color="rgba(17,19,24,.62)">Neutral is not cold · it is respectful</Footer>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ background: social.ink, color: social.ivory }}>
      <div style={{ position: 'absolute', inset: '0 0 920px 0' }}><Photo src="assets/images/posts/301/family-cheonggyecheon.jpg" style={{ filter: 'saturate(.56) brightness(.62)' }} /></div>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, transparent 28%, #111318 55%)' }} />
      <Brand />
      <div style={{ position: 'absolute', left: 54, right: 54, top: 820, zIndex: 18 }}>
        <Kicker color="#9eb8ff">The one rule</Kicker>
        <Display size={123} style={{ marginTop: 31 }}>Understand it</Display>
        <Display size={139} color={social.red}>before you use it</Display>
        <div style={{ marginTop: 56, font: `900 40px/1.15 ${body}` }}>Save this for your first real conversation.</div>
        <div style={{ marginTop: 68, borderTop: `9px solid ${social.cobalt}`, paddingTop: 28, font: `900 78px/1 ${body}`, letterSpacing: -3 }}>epickor.com</div>
      </div>
      <Footer>Full Korean address-term guide</Footer><Grain />
    </AbsoluteFill>
  );
}

const morning = { blue: '#2449d8', yellow: '#ffc928', red: '#ee3e2b', rice: '#fff8e8', ink: '#15171b' };

function Clock({ text, light = false }: { text: string; light?: boolean }) {
  return <div style={{ display: 'inline-block', padding: '12px 17px', color: light ? morning.ink : morning.rice, background: light ? morning.yellow : morning.blue, font: `900 28px/1 ${body}`, letterSpacing: 3 }}>{text}</div>;
}

function MorningScene({ n }: { n: number }) {
  if (n === 1) return <AbsoluteFill style={{ background: morning.ink, color: morning.rice }}>
    <Photo src="assets/reels/302/design/scene-1.jpg" style={{ filter: 'saturate(.82) brightness(.7) contrast(1.08)', objectPosition: 'center 45%' }} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(21,23,27,.1), rgba(21,23,27,.15) 42%, rgba(21,23,27,.94) 88%)' }} />
    <Brand/><div style={{ position: 'absolute', right: 54, top: 48, zIndex: 30 }}><Clock text="07:03 SEOUL" light /></div>
    <div style={{ position: 'absolute', left: 54, right: 54, top: 670, zIndex: 18 }}>
      <Kicker background={morning.red}>Korean morning mystery</Kicker>
      <Display size={169} style={{ marginTop: 33 }}>Soup at</Display><Display size={219} color={morning.yellow}>7 AM?</Display>
      <div style={{ marginTop: 35, width: 250, height: 10, background: morning.red }} />
    </div>
    <div style={{ position: 'absolute', left: 54, right: 54, bottom: 155, zIndex: 18, font: `900 37px/1.16 ${body}` }}>In Korea, that isn&apos;t even<br/><span style={{ color: morning.yellow }}>the surprising part.</span></div>
    <Footer>Seoul 7:03 AM · live morning file</Footer><Grain/>
  </AbsoluteFill>;

  if (n === 2) return <AbsoluteFill style={{ background: morning.rice, color: morning.ink }}>
    <div style={{ position: 'absolute', inset: '0 0 680px 0' }}><Photo src="assets/images/posts/302/korean-rice-soup-banchan.jpg" style={{ filter: 'saturate(.76) contrast(1.03)' }} /></div>
    <Brand/><div style={{ position: 'absolute', left: 0, right: 0, top: 1140, bottom: 0, background: morning.blue, color: morning.rice, padding: '66px 54px 54px' }}>
      <Kicker color={morning.yellow}>The misconception</Kicker>
      <Display size={131} style={{ marginTop: 31 }}>No hard</Display><Display size={156} color={morning.yellow}>food border</Display>
      <div style={{ marginTop: 45, display: 'flex', gap: 16 }}>{['BREAKFAST','LUNCH','DINNER'].map((x,i)=><div key={x} style={{ flex:1, padding:'20px 8px', textAlign:'center', background:i===0?morning.red:'rgba(255,255,255,.12)', font:`900 23px/1 ${body}`, letterSpacing:1.5 }}>{x}</div>)}</div>
      <div style={{ marginTop: 34, font: `800 34px/1.18 ${body}` }}>Rice and soup can cross every clock.</div>
    </div>
    <Footer>Meals first · labels second</Footer>
  </AbsoluteFill>;

  if (n === 3) return <AbsoluteFill style={{ background: morning.yellow, color: morning.ink }}>
    <Brand color={morning.ink}/><div style={{ position:'absolute', left:54, right:54, top:150, height:800, overflow:'hidden', boxShadow:'18px 20px 0 #2449d8' }}><Photo src="assets/images/posts/302/rice-porridge.jpg" /></div>
    <div style={{ position:'absolute', left:54, right:54, top:1030 }}><Kicker color={morning.red}>A real modern range</Kicker><Display size={122} style={{marginTop:31}}>Full tray.</Display><Display size={122} color={morning.blue}>One bowl.</Display><Display size={122} color={morning.red}>Just coffee.</Display>
      <div style={{marginTop:47,borderTop:`5px solid ${morning.ink}`,paddingTop:25,font:`900 34px/1.15 ${body}`}}>The clock changes. The food doesn&apos;t have to.</div></div>
    <Footer color="rgba(21,23,27,.66)">Morning is a schedule · not a menu</Footer>
  </AbsoluteFill>;

  if (n === 4) return <AbsoluteFill style={{ background: morning.red, color: morning.rice }}>
    <div style={{ position:'absolute', inset:'0 0 900px 0' }}><Photo src="assets/reels/302/design/scene-4.jpg" style={{ filter:'saturate(.78) contrast(1.07)' }}/></div><Brand/>
    <div style={{position:'absolute',left:54,right:54,top:930}}><Clock text="08:11 · TRAIN DAY" light/><Display size={147} style={{marginTop:36}}>Portable</Display><Display size={179} color={morning.yellow}>counts</Display>
      <div style={{marginTop:40,display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>{[['GIMBAP','DEPENDABLE'],['STREET TOAST','SWEET + SAVORY']].map(([a,b])=><div key={a} style={{padding:'29px 25px',border:'3px solid rgba(255,255,255,.7)'}}><div style={{font:`900 36px/1 ${body}`}}>{a}</div><div style={{marginTop:15,color:morning.yellow,font:`900 21px/1 ${body}`,letterSpacing:2}}>{b}</div></div>)}</div>
    </div><Footer>Eat while the city moves</Footer><Grain/>
  </AbsoluteFill>;

  if (n === 5) return <AbsoluteFill style={{ background: morning.ink, color: morning.ink }}>
    <Photo src="assets/reels/302/design/scene-5.jpg" style={{filter:'brightness(.46) saturate(.72)'}}/><AbsoluteFill style={{background:'rgba(36,73,216,.26)'}}/><Brand/>
    <div style={{position:'absolute',left:54,right:54,top:160,bottom:180,background:'rgba(255,248,232,.95)',padding:'44px 39px',boxSizing:'border-box'}}><Kicker color={morning.blue}>Choose your morning</Kicker><Display size={107} style={{marginTop:28}}>What do you need?</Display>
      <div style={{marginTop:45,borderTop:`6px solid ${morning.ink}`}}>{[['JET-LAGGED','JUK'],['BIG WALKING DAY','GUKBAP'],['EARLY TRAIN','GIMBAP'],['FUN FIRST BITE','STREET TOAST']].map(([a,b],i)=><div key={a} style={{minHeight:220,display:'grid',gridTemplateColumns:'1.35fr 1fr',alignItems:'center',gap:20,borderBottom:'2px solid rgba(21,23,27,.18)',background:i===3?'rgba(238,62,43,.08)':'transparent'}}><div style={{font:`900 26px/1.06 ${body}`,letterSpacing:1.7,color:'#62646a'}}>{a}</div><div style={{font:`900 47px/1 ${body}`,color:[morning.blue,morning.red,morning.ink,morning.red][i]}}>{b}</div></div>)}</div>
      <div style={{position:'absolute',left:39,right:39,bottom:35,textAlign:'center',font:`900 22px/1.1 ${body}`,letterSpacing:2,color:'#696a6f'}}>PICK THE MORNING YOU HAVE.</div>
    </div><Grain/>
  </AbsoluteFill>;

  if (n === 6) return <AbsoluteFill style={{background:morning.rice,color:morning.ink}}>
    <div style={{position:'absolute',inset:'0 0 730px 0'}}><Photo src="assets/images/posts/302/kimchi-fried-rice.jpg" style={{filter:'saturate(.86) contrast(1.05)'}}/></div><Brand/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:820,background:morning.yellow,padding:'70px 54px'}}><Kicker color={morning.red}>Real life is compressed</Kicker><Display size={141} style={{marginTop:32}}>Leftovers</Display><Display size={185} color={morning.red}>count</Display><div style={{marginTop:42,font:`900 39px/1.14 ${body}`}}>So does convenience food.<br/>So does coffee.</div></div><Footer color="rgba(21,23,27,.65)">Authentic can still be fast</Footer>
  </AbsoluteFill>;

  return <AbsoluteFill style={{background:morning.blue,color:morning.rice}}>
    <div style={{position:'absolute',inset:'0 0 930px 0'}}><Photo src="assets/images/posts/302/gilgeori-toast.jpg" style={{filter:'saturate(.75) brightness(.75)'}}/></div><AbsoluteFill style={{background:'linear-gradient(180deg,transparent 28%,#2449d8 55%)'}}/><Brand/>
    <div style={{position:'absolute',left:54,right:54,top:830,zIndex:18}}><Clock text="THE REAL ANSWER" light/><Display size={128} style={{marginTop:35}}>A system.</Display><Display size={153} color={morning.yellow}>Not a menu.</Display><div style={{marginTop:48,font:`900 39px/1.15 ${body}`}}>Save this before your first Seoul morning.</div><div style={{marginTop:68,borderTop:`9px solid ${morning.red}`,paddingTop:28,font:`900 78px/1 ${body}`}}>epickor.com</div></div><Footer>All 12 Korean breakfast options</Footer><Grain/>
  </AbsoluteFill>;
}

const kitchen = { ink:'#11151a', steel:'#b7c2c9', flame:'#ff5a1f', teal:'#00d0c6', yellow:'#ffc928', white:'#f5f6f2' };

function KitchenScene({ n }: { n: number }) {
  if(n===1)return <AbsoluteFill style={{background:kitchen.ink,color:kitchen.white}}><Photo src="assets/reels/299/design/scene-1.jpg" style={{filter:'brightness(.62) saturate(.78) contrast(1.12)'}}/><AbsoluteFill style={{background:'linear-gradient(180deg,rgba(17,21,26,.18),rgba(17,21,26,.88) 80%)'}}/><Brand/>
    {[0,1,2].map(i=><div key={i} style={{position:'absolute',left:100-i*30,right:100-i*30,top:350-i*55,height:520+i*110,border:`${9-i*2}px solid rgba(255,90,31,${.78-i*.18})`,borderRadius:'50%',transform:`rotate(${i*5-5}deg)`,zIndex:12}}/>)}
    <div style={{position:'absolute',left:54,top:210,zIndex:18}}><Kicker background={kitchen.flame}>Residual heat test</Kicker></div><div style={{position:'absolute',left:54,right:54,top:800,zIndex:18}}><Display size={127}>Off the flame</Display><Display size={174} color={kitchen.flame}>still cooking</Display><div style={{marginTop:35,font:`900 36px/1.14 ${body}`}}>The pot&apos;s job continues at the table.</div></div><Footer>Kitchen heat lab · test 01</Footer><Grain/></AbsoluteFill>;

  if(n===2)return <AbsoluteFill style={{background:kitchen.white,color:kitchen.ink}}><div style={{position:'absolute',inset:'0 0 760px 0'}}><Photo src="assets/images/posts/299/pexels-ttukbaegi-stew.jpg" style={{filter:'saturate(.72) contrast(1.06)'}}/></div><Brand/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:850,background:kitchen.ink,color:kitchen.white,padding:'68px 54px'}}><Kicker color={kitchen.teal}>Tool 01 · ttukbaegi</Kicker><Display size={151} style={{marginTop:32}}>Holds heat</Display><Display size={129} color={kitchen.flame}>keeps changing food</Display><div style={{marginTop:44,display:'flex',alignItems:'center',gap:18}}><div style={{flex:1,height:9,background:kitchen.flame}}/><div style={{font:`900 30px/1 ${body}`,color:kitchen.steel}}>BURNER → TABLE</div></div></div><Footer>Residual heat is part of the recipe</Footer></AbsoluteFill>;

  if(n===3)return <AbsoluteFill style={{background:kitchen.yellow,color:kitchen.ink}}><Brand color={kitchen.ink}/><div style={{position:'absolute',left:54,right:54,top:145,height:825,overflow:'hidden',border:`10px solid ${kitchen.ink}`}}><Photo src="assets/images/posts/299/pexels-korean-ramen-pot.jpg"/></div>
    <div style={{position:'absolute',left:54,right:54,top:1040}}><Kicker color={kitchen.ink}>Tool 02 · thin ramen pot</Kicker><Display size={139} style={{marginTop:30}}>Fast heat.</Display><Display size={139} color={kitchen.flame}>Fast overflow.</Display><div style={{marginTop:42,display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>{[['LIGHT','REACTIVE'],['ICONIC','NOT UNIVERSAL']].map(([a,b])=><div key={a} style={{padding:'24px',background:kitchen.ink,color:kitchen.white}}><div style={{font:`900 36px/1 ${body}`}}>{a}</div><div style={{marginTop:13,color:kitchen.teal,font:`900 19px/1 ${body}`,letterSpacing:2}}>{b}</div></div>)}</div></div><Footer color="rgba(17,21,26,.66)">Check material · handle · burner fit</Footer></AbsoluteFill>;

  if(n===4)return <AbsoluteFill style={{background:kitchen.ink,color:kitchen.white}}><Photo src="assets/reels/299/design/scene-4.jpg" style={{filter:'brightness(.62) saturate(.7) contrast(1.1)'}}/><AbsoluteFill style={{background:'linear-gradient(180deg,rgba(17,21,26,.18),rgba(17,21,26,.92) 83%)'}}/><Brand/><div style={{position:'absolute',left:54,right:54,top:760,zIndex:18}}><Kicker color={kitchen.teal}>Korean BBQ workflow</Kicker><Display size={166} style={{marginTop:30}}>Pan</Display><div style={{display:'flex',alignItems:'baseline',gap:25}}><div style={{font:`900 142px/1 ${body}`,color:kitchen.flame}}>≠</div><Display size={166}>system</Display></div><div style={{marginTop:45,display:'flex',flexWrap:'wrap',gap:13}}>{['VENT','GREASE','TONGS','SCISSORS'].map((x,i)=><div key={x} style={{padding:'18px 21px',background:i===3?kitchen.flame:'rgba(255,255,255,.12)',border:`2px solid ${i===3?kitchen.flame:'rgba(255,255,255,.35)'}`,font:`900 24px/1 ${body}`,letterSpacing:2}}>{x}</div>)}</div></div><Footer>One pan cannot solve the room</Footer><Grain/></AbsoluteFill>;

  if(n===5)return <AbsoluteFill style={{background:kitchen.ink,color:kitchen.white}}><Photo src="assets/reels/299/design/scene-5.jpg" style={{filter:'brightness(.38) saturate(.62) contrast(1.1)'}}/><AbsoluteFill style={{background:'rgba(17,21,26,.42)'}}/><Brand/><div style={{position:'absolute',left:54,right:54,top:155,bottom:180,zIndex:18,background:'rgba(17,21,26,.91)',border:`2px solid rgba(183,194,201,.42)`,padding:'42px 38px',boxSizing:'border-box',boxShadow:'0 30px 90px rgba(0,0,0,.42)'}}><Kicker color={kitchen.teal}>Heat-lab result</Kicker><Display size={108} style={{marginTop:27}}>What do you repeat?</Display>
    <div style={{marginTop:43,borderTop:`6px solid ${kitchen.flame}`}}>{[['STEW','TTUKBAEGI'],['RAMYEON','COMPATIBLE SMALL POT'],['HOME BBQ','SCISSORS + TONGS FIRST'],['MIXED USE','KEEP YOUR SAUCEPAN']].map(([a,b],i)=><div key={a} style={{minHeight:151,display:'grid',gridTemplateColumns:'230px 1fr',gap:22,alignItems:'center',borderBottom:'1px solid rgba(183,194,201,.27)'}}><div style={{font:`900 25px/1 ${body}`,letterSpacing:2,color:kitchen.steel}}>{a}</div><div style={{font:`900 ${i===1||i===2?34:42}px/1.04 ${body}`,color:i===3?kitchen.teal:kitchen.white}}>{b}</div></div>)}</div><div style={{position:'absolute',left:38,right:38,bottom:33,textAlign:'center',font:`900 21px/1.1 ${body}`,letterSpacing:2,color:kitchen.steel}}>THE FIRST TOOL FIXES A REPEATED JOB.</div></div><Grain/></AbsoluteFill>;

  if(n===6)return <AbsoluteFill style={{background:kitchen.white,color:kitchen.ink}}><div style={{position:'absolute',inset:'0 0 760px 0'}}><Photo src="assets/images/posts/299/pexels-bbq-scissors.jpg" style={{filter:'saturate(.7) contrast(1.06)'}}/></div><Brand/><div style={{position:'absolute',left:0,right:0,bottom:0,height:850,background:kitchen.white,padding:'70px 54px'}}><Kicker color={kitchen.flame}>Lowest-risk first upgrade</Kicker><Display size={159} style={{marginTop:31}}>Scissors</Display><Display size={123} color={kitchen.teal}>before the grill pan</Display><div style={{marginTop:48,borderTop:`7px solid ${kitchen.ink}`,paddingTop:28,font:`900 31px/1.2 ${body}`,letterSpacing:1.2}}>CHECK STOVE · VENT · CLEANUP<br/><span style={{color:'#656a70'}}>THEN ADD SPECIALIZED HEAT.</span></div></div><Footer color="rgba(17,21,26,.62)">Buy the workflow · not the prop</Footer></AbsoluteFill>;

  return <AbsoluteFill style={{background:kitchen.ink,color:kitchen.white}}><Photo src="assets/reels/299/design/scene-7.jpg" style={{filter:'brightness(.46) saturate(.66) contrast(1.09)'}}/><AbsoluteFill style={{background:'linear-gradient(180deg,rgba(17,21,26,.08),#11151a 70%)'}}/><Brand/><div style={{position:'absolute',left:54,right:54,top:760,zIndex:18}}><Kicker color={kitchen.teal}>Before you buy</Kicker><Display size={157} style={{marginTop:32}}>Buy for</Display><Display size={183} color={kitchen.flame}>the heat</Display><div style={{marginTop:35,font:`900 44px/1.12 ${body}`}}>Not the photograph.</div><div style={{marginTop:62,font:`900 36px/1.1 ${body}`}}>Save this before building the kit.</div><div style={{marginTop:62,borderTop:`9px solid ${kitchen.teal}`,paddingTop:29,font:`900 78px/1 ${body}`}}>epickor.com</div></div><Footer>Full Korean cookware decision guide</Footer><Grain/></AbsoluteFill>;
}

export function Reel301PosterFrame({ sceneNumber }: PosterProps) { return <SocialScene n={sceneNumber} />; }
export function Reel302PosterFrame({ sceneNumber }: PosterProps) { return <MorningScene n={sceneNumber} />; }
export function Reel299PosterFrame({ sceneNumber }: PosterProps) { return <KitchenScene n={sceneNumber} />; }

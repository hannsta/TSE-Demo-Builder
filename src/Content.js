import React, { useState, useEffect, setState } from 'react';
import { init,  AuthType} from '@thoughtspot/visual-embed-sdk';
import { SearchEmbed, LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/react';


function Content(props) {
const {
  settings,
  showSettings,
  newSettings
} = props
const thoughtspot_URL = "https://se-thoughtspot-cloud.thoughtspot.cloud/#" 

const [renderType, setRenderType] = useState('')
const [renderContent, setRenderContent] = useState('')


useEffect(() => {
  if (settings.URL){
    try {
      init({
        thoughtSpotHost: settings.URL,
        authType: AuthType.None,
      });
    }
    catch(err){
      alert("could not connect to thoughtspot")
    }
  }
}, [])

function renderLink(type,content){
  setRenderContent(content);
  setRenderType(type);
}
const leftMenu = {
  background: settings.primaryColor,
  color: settings.secondaryColor,
  borderRight: '1px solid #dddddd',
  width: '150px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0px 0px 15px #dddddd'
}
if (settings.links){
  var linkContainers = []
  var topLevel = []
  for (var link of settings.links){
    if (!settings.linkParents[link] || settings.linkParents[link]=='None'){
      topLevel.push(link)
    }
  }
  for (var link of topLevel){
    var childrenLinks = []
    for (var child of settings.links){
      if (settings.linkParents[child]==settings.linkNames[link]){
        childrenLinks.push(
          <LinkContainer
          key={child}
          id={child}
          name={settings.linkNames[child]}
          content={settings.linkContents[child]}
          type={settings.linkTypes[child]}
          renderLink={renderLink}
        />
        )
      }
    }
    linkContainers.push(<LinkContainer
      key={link}
      id={link}
      name={settings.linkNames[link]}
      content={settings.linkContents[link]}
      type={settings.linkTypes[link]}
      renderLink={renderLink}
      children={childrenLinks}
    />)
  }
}
document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);


var renderPage = <div>Select a Link!</div>
if (renderType=='Search'){
  renderPage = <SearchEmbed hideDataSources={true} frameParams={{width:'100%',height:'100vh'}}
  />
}
if (renderType=='Liveboard'){
  renderPage = <LiveboardEmbed  hideDataSources={true} liveboardId={renderContent} frameParams={{width:'100%',height:'100vh'}}
  />
}
if (renderType=='Answer'){
  renderPage = <SearchEmbed hideDataSources={true} answerId={renderContent} frameParams={{width:'100%',height:'100vh'}}
  />
}
if (renderType=='App'){

}
if (renderType=='URL'){
  renderPage = <iframe primaryNavHidden="true" embedApp="true" style={{width:'100%',height:'100%',border:'none'}} src={renderContent}></iframe>
}

const logoImageHolder = {
  height: '150px',
  width: '150px',
  display: 'flex',
  justifyContent: 'center',
  alignItems:'center',
  marginTop:'20px',
  marginBottom:'20px'
}
function openTS(){
  window.open(settings.URL,'_blank')
}
function openGit(){
  window.open('https://github.com/hannsta/TSE-Demo-Builder','_blank')
}
return (
  <div id="container">
      <div style={leftMenu}>
        <div style={logoImageHolder}><img src={settings.logoImage}className="logoImage"></img></div>

        {linkContainers}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center', justifyContent:'flex-end',height:'100vh'}}>
          <div style={{display:'flex',flexDirection:'row',alignItems:'center',marginBottom:'10px'}}>
            <div onClick={newSettings} style={{marginRight:'5px'}}>
            <PlusIcon />
            </div>
            <div onClick={showSettings} style={{marginRight:'5px'}}>
            <SettingsIcon />
            </div>
            <div style={{width:'30px',height:'30px',marginRight:'5px'}} onClick={openTS} >
            <TSLogo />
            </div>
            <div style={{width:'25px',height:'25px', marginRight:'5px'}} onClick={openGit}>
            <GitHubLogo/>
            </div>
          </div>
        </div>

      </div>
      <div id="TSContainer">
        {renderPage}
      </div>
  </div>
)
}
function LinkContainer(props){
  const {
    id,
    name,
    content,
    type,
    renderLink,
    children,
  } = props
  
  const [hoverVisible, setHoverVisible] = useState('')

  function handleLinkClick(){
    renderLink(type, content)
  }
  var isDropdown=false;
  if (children){
    if (children.length>0){
      isDropdown=true;
    }
  }

  function handleMouseEnter(){
    setHoverVisible(true)
  }
  function handleMouseLeave(){
    setHoverVisible(false)
  }
  return(
    <div>

      {isDropdown 
        ?
        <div className="contentLink" onMouseEnter={handleMouseLeave} onMouseLeave={handleMouseEnter}>
            {name}
            {hoverVisible ? 
              null
            : 
            <div className='hoverMenu'>
              {children}
            </div>}

        </div>
        :
        <div className="contentLink" onClick={handleLinkClick}>
            {name}
        </div>      
      }      
  </div>)
}




function UserIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-14a4 4 0 0 1 4 4v2a4 4 0 1 1-8 0V8a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0V8a2 2 0 0 0-2-2zM5.91 16.876a8.033 8.033 0 0 1-1.58-1.232 5.57 5.57 0 0 1 2.204-1.574 1 1 0 1 1 .733 1.86c-.532.21-.993.538-1.358.946zm8.144.022a3.652 3.652 0 0 0-1.41-.964 1 1 0 1 1 .712-1.868 5.65 5.65 0 0 1 2.284 1.607 8.032 8.032 0 0 1-1.586 1.225z"></path></svg>
}
function SettingsIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M20 8.163A2.106 2.106 0 0 0 18.926 10c0 .789.433 1.476 1.074 1.837l-.717 2.406a2.105 2.105 0 0 0-2.218 3.058l-2.062 1.602A2.104 2.104 0 0 0 11.633 20l-3.29-.008a2.104 2.104 0 0 0-3.362-1.094l-2.06-1.615A2.105 2.105 0 0 0 .715 14.24L0 11.825A2.106 2.106 0 0 0 1.051 10C1.051 9.22.63 8.54 0 8.175L.715 5.76a2.105 2.105 0 0 0 2.207-3.043L4.98 1.102A2.104 2.104 0 0 0 8.342.008L11.634 0a2.104 2.104 0 0 0 3.37 1.097l2.06 1.603a2.105 2.105 0 0 0 2.218 3.058L20 8.162zM14.823 3.68c0-.063.002-.125.005-.188l-.08-.062a4.103 4.103 0 0 1-4.308-1.428l-.904.002a4.1 4.1 0 0 1-4.29 1.43l-.095.076A4.108 4.108 0 0 1 2.279 7.6a4.1 4.1 0 0 1 .772 2.399c0 .882-.28 1.715-.772 2.4a4.108 4.108 0 0 1 2.872 4.09l.096.075a4.104 4.104 0 0 1 4.289 1.43l.904.002a4.1 4.1 0 0 1 4.307-1.428l.08-.062A4.108 4.108 0 0 1 17.7 12.4a4.102 4.102 0 0 1-.773-2.4c0-.882.281-1.716.773-2.4a4.108 4.108 0 0 1-2.876-3.919zM10 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg>
}
function PlusIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0-2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm7 11v4a1 1 0 0 1-2 0v-4H5a1 1 0 0 1 0-2h4V5a1 1 0 1 1 2 0v4h4a1 1 0 0 1 0 2h-4z"></path></svg>;
}
function TSLogo(){
  return <svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="100%" height="100%" viewBox='0 0 512 512'><g fill="currentColor" fill-rule="evenodd"><path d="M328.33 378.112c0-20.677 16.767-37.445 37.444-37.445 20.684 0 37.448 16.768 37.448 37.445 0 20.68-16.764 37.448-37.448 37.448-20.677 0-37.445-16.768-37.445-37.448M106 209.61h100.634v203.608h18.72V209.61h18.724v203.608h18.724V209.61h18.72v203.608h18.725V209.61H400.88v-18.724H106v18.724M106 172.165h294.88v-18.724H106zM106 134.72h294.88V116H106z"/></g></svg>;
}
function GitHubLogo(){
  return <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 256 250" version="1.1" preserveAspectRatio="xMidYMid"><g><path d="M128.00106,0 C57.3172926,0 0,57.3066942 0,128.00106 C0,184.555281 36.6761997,232.535542 87.534937,249.460899 C93.9320223,250.645779 96.280588,246.684165 96.280588,243.303333 C96.280588,240.251045 96.1618878,230.167899 96.106777,219.472176 C60.4967585,227.215235 52.9826207,204.369712 52.9826207,204.369712 C47.1599584,189.574598 38.770408,185.640538 38.770408,185.640538 C27.1568785,177.696113 39.6458206,177.859325 39.6458206,177.859325 C52.4993419,178.762293 59.267365,191.04987 59.267365,191.04987 C70.6837675,210.618423 89.2115753,204.961093 96.5158685,201.690482 C97.6647155,193.417512 100.981959,187.77078 104.642583,184.574357 C76.211799,181.33766 46.324819,170.362144 46.324819,121.315702 C46.324819,107.340889 51.3250588,95.9223682 59.5132437,86.9583937 C58.1842268,83.7344152 53.8029229,70.715562 60.7532354,53.0843636 C60.7532354,53.0843636 71.5019501,49.6441813 95.9626412,66.2049595 C106.172967,63.368876 117.123047,61.9465949 128.00106,61.8978432 C138.879073,61.9465949 149.837632,63.368876 160.067033,66.2049595 C184.49805,49.6441813 195.231926,53.0843636 195.231926,53.0843636 C202.199197,70.715562 197.815773,83.7344152 196.486756,86.9583937 C204.694018,95.9223682 209.660343,107.340889 209.660343,121.315702 C209.660343,170.478725 179.716133,181.303747 151.213281,184.472614 C155.80443,188.444828 159.895342,196.234518 159.895342,208.176593 C159.895342,225.303317 159.746968,239.087361 159.746968,243.303333 C159.746968,246.709601 162.05102,250.70089 168.53925,249.443941 C219.370432,232.499507 256,184.536204 256,128.00106 C256,57.3066942 198.691187,0 128.00106,0 Z M47.9405593,182.340212 C47.6586465,182.976105 46.6581745,183.166873 45.7467277,182.730227 C44.8183235,182.312656 44.2968914,181.445722 44.5978808,180.80771 C44.8734344,180.152739 45.876026,179.97045 46.8023103,180.409216 C47.7328342,180.826786 48.2627451,181.702199 47.9405593,182.340212 Z M54.2367892,187.958254 C53.6263318,188.524199 52.4329723,188.261363 51.6232682,187.366874 C50.7860088,186.474504 50.6291553,185.281144 51.2480912,184.70672 C51.8776254,184.140775 53.0349512,184.405731 53.8743302,185.298101 C54.7115892,186.201069 54.8748019,187.38595 54.2367892,187.958254 Z M58.5562413,195.146347 C57.7719732,195.691096 56.4895886,195.180261 55.6968417,194.042013 C54.9125733,192.903764 54.9125733,191.538713 55.713799,190.991845 C56.5086651,190.444977 57.7719732,190.936735 58.5753181,192.066505 C59.3574669,193.22383 59.3574669,194.58888 58.5562413,195.146347 Z M65.8613592,203.471174 C65.1597571,204.244846 63.6654083,204.03712 62.5716717,202.981538 C61.4524999,201.94927 61.1409122,200.484596 61.8446341,199.710926 C62.5547146,198.935137 64.0575422,199.15346 65.1597571,200.200564 C66.2704506,201.230712 66.6095936,202.705984 65.8613592,203.471174 Z M75.3025151,206.281542 C74.9930474,207.284134 73.553809,207.739857 72.1039724,207.313809 C70.6562556,206.875043 69.7087748,205.700761 70.0012857,204.687571 C70.302275,203.678621 71.7478721,203.20382 73.2083069,203.659543 C74.6539041,204.09619 75.6035048,205.261994 75.3025151,206.281542 Z M86.046947,207.473627 C86.0829806,208.529209 84.8535871,209.404622 83.3316829,209.4237 C81.8013,209.457614 80.563428,208.603398 80.5464708,207.564772 C80.5464708,206.498591 81.7483088,205.631657 83.2786917,205.606221 C84.8005962,205.576546 86.046947,206.424403 86.046947,207.473627 Z M96.6021471,207.069023 C96.7844366,208.099171 95.7267341,209.156872 94.215428,209.438785 C92.7295577,209.710099 91.3539086,209.074206 91.1652603,208.052538 C90.9808515,206.996955 92.0576306,205.939253 93.5413813,205.66582 C95.054807,205.402984 96.4092596,206.021919 96.6021471,207.069023 Z" fill="currentColor"/></g></svg>
}
export default Content;
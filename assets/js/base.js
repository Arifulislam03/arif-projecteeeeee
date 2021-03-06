'use strict'


/////////////////////////////////////////////////////////// consts

const BNBDIV = 10**18;
const CHAINID = 56;

let PROVIDER;
if (window.ethereum) {
	PROVIDER = new ethers.providers.Web3Provider(window.ethereum);
	(async function () {
    let network = await PROVIDER.getNetwork();
    if (network['chainId'] != CHAINID) {
      alert('Network is not BSC. Requesting to change network');
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x38",
          rpcUrls: ["https://bsc-dataseed.binance.org"],
        }],
      });
    }
  })();
  
} else {
  PROVIDER = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org", {name: 'binance', 'chainId': 56});
}
const SIGNER =  PROVIDER.getSigner();


const ADRS = {};
const ABIS = {};

ADRS['web3'] = "0x333FD139cAeF6Aa31056cC905987b77B1044d259",
ABIS['web3'] = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "function manualRebase()",
  "function _lastRebaseBlock() view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];


ADRS['factory'] = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
ABIS['factory'] = [
  "function getPair(address tokenA, address tokenB) view returns (address pair)",
];


ADRS['router'] = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
ABIS['router'] = [
  "function getAmountsOut(uint, address[]) view returns (uint[])",
  "function swapExactETHForTokens(uint, address[], address, uint) payable returns (uint[])",
];

ADRS['pair'] = "0x9f7d235b7d3f4403133A559b0968361687e4fC62";
ABIS['pair'] = [
  "function token0() view returns (address)",
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];

ADRS['nft'] = "0x933D6472131545BC742Cde7d051a443eA0683a85";
ABIS['nft'] = [
  "function _ownedTotalItemCount(address) view returns (uint)",
  "function tokenOfOwnerByIndex(address, uint) view returns (uint)",
  "function _itemById(uint) view returns (uint)",
];

ADRS['wbnb'] = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
ADRS['busd'] = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
ADRS['cake'] = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";

const CONTS = {};
const SIGNS = {};
for (let name in ABIS) {
  CONTS[name] = new ethers.Contract(ADRS[name], ABIS[name], PROVIDER);
  SIGNS[name] = CONTS[name].connect(SIGNER);
}

// our token launch time: 2022.03.22 02:30:03 PM UTC
// https://bscscan.com/tx/0x3745eb92a39460e840aa5503872f7c2fe513f061e8e0e7c59b35fad7841b2896
const STARTBLOCK = 16282771; 

let CURBLOCK;
(async () => {
	CURBLOCK = await PROVIDER.getBlockNumber();
})();

////////////////////////////////// base

function INT(n) {
  return parseInt(n);
}
function STR(s) {
	return String(s);
}

function ROUND(v, n=0) {
  return v.toFixed(n);
}

function BNB(value, n=4) {
  value = INT(value);
  return ROUND(value / BNBDIV, n);
}

function WRAP(v) {
	return "[" + v + "]";
}

function COMMA(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function SHORTADR(adr) {
  return adr.slice(0, 6) + '..' + adr.slice(-4);;
}

function KEYS(dict) {
	return Object.keys(dict);
}

function ADELAY(milSec) {
  return new Promise(r => setTimeout(r, milSec));
}
  
function DELAY(milSec) {
  var start = new Date().getTime();
  var end = 0;
  while ((end - start) < milSec) {
    end = new Date().getTime();
  }
}

///////////////////////////////// html

function HREF(link, txt) {
	return `<a href="${link}">${txt}</a>`;
}

function select(el, all = true) {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

function displayText(el, text) {
  let els = select(el);
  for (var idx = 0; idx < els.length; idx++) {
    els[idx].innerHTML = text;
  }
}


function copy(value) {
  const input = document.createElement('textarea');
  input.value = value;
	document.body.appendChild(input);

  var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

  if (isiOSDevice) {

    var editable = input.contentEditable;
    var readOnly = input.readOnly;

    input.contentEditable = true;
    input.readOnly = false;

    var range = document.createRange();
    range.selectNodeContents(input);

    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    input.setSelectionRange(0, 999999);
    input.contentEditable = editable;
    input.readOnly = readOnly;

  } else {
    // document.body.appendChild(input);
    input.select();

  }

  document.execCommand('copy');
  //if (!isiOSDevice) {
    document.body.removeChild(input);
  //}
}

function swapComma(id, isOn) {
  var $input = $( "#" + id );
  
  if (isOn == false) {
    $input.off("keyup");
    return;
  } 
  
  $input.on( "keyup", function( event ) {
   
      // 1.
      var selection = window.getSelection().toString();
      if ( selection !== '' ) {
          return;
      }
   
      // 2.
      if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
          return;
      }
    
      // 3
      var $this = $( this );
      var input = $this.val();
   
      // 4
      var input = input.replace(/[\D\s\._\-]+/g, "");
   
      // 5
      input = input ? parseInt( input, 10 ) : 0;
   
      // 6
      $this.val( function() {
          return ( input === 0 ) ? "" : input.toLocaleString( "en-US" );
      });

  } );
}


let inputHandlerBuy = function (e) {
  (async function () {
    valueIn = e.target.value;
    valueIn = valueIn.replace(/,/g, '');
    result = select('#buy-output')[0];
    if (valueIn == 0) {
      result.value = 0;
      return;
    }

    valueIn = ethers.utils.parseEther(valueIn);
    valueOut = valueIn.mul(3330000);

    valueOut_ = ethers.utils.formatEther(valueOut);
    valueOut_ = parseInt(valueOut_);
    valueOut_ = numberWithCommas(valueOut_);
    result.value = valueOut_;

  })();
}




///////////////////////////////// web3

function BSC(type, txt) {
  return `https://bscscan.com/${type}/${txt}`;
}


function BIG(s, decimals=18) {
	if (decimals == 18) {
		return ethers.utils.parseEther(s);
  } else {
  	return ethers.utils.parseUnits(s, decimals);
  }
}
 
function ETH(big, decimals=18) {
	if (decimals == 18) {
  	return ethers.utils.formatEther(big);
  } else {
  	return ethers.utils.formatUnits(big, decimals);
  }
}
 

 
function ADR(address) {
  let checksumAdr;
  try {
    checksumAdr = ethers.utils.getAddress(address);
  } catch (error) {
    alert('Wrong Format Address: [' + address + ']');

    return '';
  }
  return checksumAdr;
}




async function getBalance(adr) {
	let balance = await PROVIDER.getBalance(adr);
 
  return balance;
}

async function getPrice(adr) {
  adr = ADRS['busd'];
  let pair = await CONTS['factory'].getPair(adr, ADRS['wbnb']);
  let cont = new ethers.Contract(pair, ABIS['pair'], PROVIDER);
  let r = await cont.getReserves();
  let t0 = await cont.token0();

  if (t0 == adr) {
    r = [r[1], r[0]];
  }

  return r[0] / r[1];
}




async function getCurAdr() {
	let curAdr = null;
	try {
  	curAdr = await SIGNER.getAddress();
  } catch (err) {
  	console.log('not connected yet');
  }
 
  return curAdr;
}


let CURADR;
function displayAccountInformation() {
  let shortAdrStr = SHORTADR(CURADR);
  
  displayText('.connect-wallet', shortAdrStr);
	
  getBalance(CURADR)
  .then((res) => {
    displayText('#balance-number', BNB(res, 4));
  });

  return;
}



async function handleAccountsChanged(accounts) {
  if (accounts.length == 0) {
    displayText("connectResult", 'Please Connect Metamask');
    return;
  }

  CURADR = ADR(accounts[0]);
  displayAccountInformation();
}

async function conn() {
	try {
  	/* CURADR = await PROVIDER.send("eth_requestAccounts", []) */;
    let accounts = await ethereum.request({ method: 'eth_requestAccounts' }); // eth_requestAccounts
    await handleAccountsChanged(accounts);
    await doAfterConnect();
  } catch (err) {
  	console.log(err);
    if (err == 'ReferenceError: ethereum is not defined') {
      alert('Use Dapp to connect wallet!');
      return;
    }
    alert(err);
  }
}

async function doAfterConnect() { // dummy
}

function handleChainChanged(_chainId) {
  // Reload the page
  window.location.reload();
}





////////////////////////////////// tx

async function SIGN(name, msg, bin=false) {
	if (bin == true) {
  	msg = ethers.utils.arrayify(msg);
  }
  return await SIGNS[name].signMessage(msg);
}
 
 
async function SEND_ETH(from=ADRS["fund"], to=ADRS["fund"], value='0.0') {
	const data = {
  	from: from,
  	to: to,
    value: BIG(value),
    /* nonce: window.ethersProvider.getTransactionCount(send_account, "latest"),
        gasLimit: ethers.utils.hexlify(gas_limit), // 100000
        gasPrice: gas_price, */
  };
  
  try {
  	let result = await SIGNER.sendTransaction(data);
    console.log('result', result);
    return [ false, result ];
  } catch (err) {
  	err = await ERR(err);
    return [ true, err ];
  }
}
 
async function READ_TX(name, method, args, from="0xe7F0704b198585B8777abe859C3126f57eB8C989") {
	const overrides = {
  	from: from,
  };
 
  try {
  	let result = await CONTS[name][method](...args, overrides);
    console.log('result', result);
    return [ false, result ];
  } catch (err) {
  	err = await ERR(err);
    return [ true, err ];
  }
 
}
 
async function ERR(err) { 
  if (!('code' in err)) {
    console.log('no code', err);
    return [ true, err ];
  }
 
  if (err['code'] == -32603) {
    if (!('data' in err)) {
      console.log('no data', err);
      return [ true, err ];
    }
 
    let data = err['data'];
    if (!('code' in data)) {
      console.log('no code data', err);
      return [ true, err ];
    }
 
    if (data['code'] == 3) {
      msg = data['message'];
      return [ false, msg ];
    }
 
    if (data['code'] == -32000) {
      msg = data['message'];
      return [ false, msg ];
    }
    
    console.log('not def', err);
    return [ true, err ];
  }
  
  console.log('no code not def', err);
  return [ false, err ];
}
 
async function GAS(name, method, args, value=null) {
  let overrides;
  if (value != null) {
    overrides = {
      value: BIG(value),
    };
  }

  try {
    let result;
    if (value != null) {
      result = await SIGNS[name].estimateGas[method](...args, overrides);
    } else {
      result = await SIGNS[name].estimateGas[method](...args);
    }
    console.log('result', result);
    return [ false, result ];
  } catch (err) {
    err = await ERR(err);
    return [ true, err ];
  }
}
 
async function SEND_TX(name, method, args, value=null, check=true) {
  let overrides = {};
  if (value != null) {
    overrides = {
      value: BIG(value),
    };
  }

  if (check == true) {
    let data = await GAS(name, method, args, value);
    let res = data[0];
    data = data[1];
    if (res == true) {
      console.log(res);
      return [ true, data ];
    } 

    // use gas result
    console.log('gas', res, INT(data));
    overrides['gasLimit'] = INT(data * 1.3);
  }

  try {
    let result;
    if (value != null) {
      result = await SIGNS[name][method](...args, overrides);
    } else {
      result = await SIGNS[name][method](...args);
    }
    console.log('result', result);
    return [ false, result ];
    /* console.log(tx.hash); */
    // wait()
    // receipt.events
  } catch (err) {
    err = await ERR(err);
    return [ true, err ];
  }
}





let buyTxhashData;
async function privateBuy() {
	let buyAmount = select('#buy-input')[0].value;
  let { res, data } = await SEND_ETH(CURADR, ADRS['fund'], buyAmount);
  if (res == true) {
  	// err
    return [ true, data ];
  }
  
  let buyResult = select('#buy-result')[0];
  buyResult.innerHTML = 'Success';
  let buyTxhash = select('#buy-txhash')[0];
  buyTxhash.innerHTML = HREF(BSC('tx', data.hash), SHORTADR(data.hash));
  buyTxhashData = data.hash;  
}


/* 
await CONTS[name].balanceOf(adr)
 */
 
/* SIGNS[name].transfer(adr, balance); */
 
/* CONTS[name].on("Transfer", (from, to, amount, event) => {
  console.log(`${ from } sent ${ formatEther(amount) } to ${ to}`);
      // The event object contains the verbatim log data, the
    // EventFragment and functions to fetch the block,
    // transaction and receipt and event functions
})
 */
// filter







/* 
await CONTS[name].balanceOf(adr)
 */

/* SIGNS[name].transfer(adr, balance); */

/* CONTS[name].on("Transfer", (from, to, amount, event) => {
  console.log(`${ from } sent ${ formatEther(amount) } to ${ to}`);
      // The event object contains the verbatim log data, the
    // EventFragment and functions to fetch the block,
    // transaction and receipt and event functions
})
 */
// filter

async function READ_TX(name, method, args, from = "0x0000000000000000000000000000000000000000") {
  const overrides = {
    from: from,
  };

  let result;
  try {
    result = await CONTS[name][method](...args, overrides);
    console.log('result', result);
  } catch (err) {
    result = await ERR(err);
  };

  return result;
}

async function ERR(err) {
  let result = err;

  if (!('code' in err)) {
    console.log('no code', err);
    return result;
  }

  if (err['code'] == -32603) {
    if (!('data' in err)) {
      console.log('no data', err);
      return result;
    }

    let data = err['data'];
    if (!('code' in data)) {
      console.log('no code data', err);
      return result;
    }

    if (data['code'] == 3) {
      msg = data['message'];
      result = msg;
      return result;
    }

    if (data['code'] == -32000) {
      msg = data['message'];
      result = msg;
      return result;
    }
  }

  return result;
}

async function GAS(name, method, args, value) {
  const overrides = {
    value: BIG(value),
  };

  let result;
  try {
    result = await SIGNS[name].estimateGas[method](...args, overrides);
    console.log('result', result);
  } catch (err) {
    result = await ERR(err);
  };

  return result;
}

async function SEND_TX(name, method, args, value, check = true) {
  const overrides = {
    value: BIG(value),
  };

  let res;
  if (check == true) {
    res = await GAS(name, method, args, value);
    if (typeof (res) == "string") {
      console.log(res);
      return;
    }

    // use gas result
    console.log(res);
  }

  let tx;
  try {
    tx = await SIGNS[name][method](...args, overrides);
    console.log(tx.hash);
    // wait()
    // receipt.events
  } catch (err) {
    console.log('err', err);
  }
}


async function getCurAdr() {
  let curAdr = null;
  try {
    curAdr = await SIGNER.getAddress();
  } catch (err) {
    console.log('not connected yet');
  }

  return curAdr;
}


(async () => {
  ethereum.on('chainChanged', handleChainChanged);
  ethereum.on('accountsChanged', handleAccountsChanged);
 
  // do global
 
//   let balance = await getBalance("0x0000000000000000000000000000000000000000");
//   console.log(ETH(balance));
 
//   let args;
//   args = [BIG('1.0'), [ADRS['wbnb'], ADRS['cake']]];
//   await READ_TX('router', 'getAmountsOut', args);
//   args = [BIG('1.0'), [ADRS['wbnb'], ADRS['cake']], ADRS['cake'], 1000000000000000];
//   await SEND_TX('router', 'swapExactETHForTokens', args, '1.0');
 
//   CURADR = await getCurAdr();
//   if (CURADR == null) {
//   	// connect wallet button
//   } else {
//   	// display address
//   }
  
//   if (CURADR == null) {
//   	return;
//   }
 
  // do personal

 
  console.log('done');
})();
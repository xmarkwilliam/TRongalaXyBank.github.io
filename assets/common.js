(function() {
	'use strict';

	const ABI = [{"constant":true,"inputs":[],"name":"contractInfo","outputs":[{"name":"_invested","type":"uint256"},{"name":"_withdrawn","type":"uint256"},{"name":"_direct_bonus","type":"uint256"},{"name":"_match_bonus","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"userInfo","outputs":[{"name":"for_withdraw","type":"uint256"},{"name":"total_invested","type":"uint256"},{"name":"total_withdrawn","type":"uint256"},{"name":"total_match_bonus","type":"uint256"},{"name":"structure","type":"uint256[3]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"back","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"direct_bonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"payoutOf","outputs":[{"name":"value","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tarifs","outputs":[{"name":"life_days","type":"uint8"},{"name":"percent","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tarif","type":"uint8"},{"name":"_upline","type":"address"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ref_bonuses","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"match_bonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"withdrawn","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"invested","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"players","outputs":[{"name":"upline","type":"address"},{"name":"dividends","type":"uint256"},{"name":"direct_bonus","type":"uint256"},{"name":"match_bonus","type":"uint256"},{"name":"last_payout","type":"uint40"},{"name":"total_invested","type":"uint256"},{"name":"total_withdrawn","type":"uint256"},{"name":"total_match_bonus","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":true,"name":"upline","type":"address"},{"indexed":false,"name":"bonus","type":"uint256"}],"name":"Upline","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"tarif","type":"uint8"}],"name":"NewDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"MatchPayout","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"}];

    let contract = null;

    let VueTRON = {
        data() {
            return {
                tron: {	
                    tronWeb: false,
                    auth: false,
                    account: ''
                }
            };
        },
        created() {
            let self = this,
                tries = 0;

            setTimeout(function initTimer() {
                if(!window.tronWeb) return ++tries < 50 ? setTimeout(initTimer, 100) : null;

                self.tron.tronWeb = !!window.tronWeb;

                window.tronWeb.on('addressChanged', function() {
                    self.tron.account = window.tronWeb.defaultAddress.base58;
                });

                setTimeout(function chechAuth() {
                    self.tron.auth = window.tronWeb && window.tronWeb.ready;
                    if(!self.tron.auth) setTimeout(chechAuth, 200);
                    else self.tron.account = window.tronWeb.defaultAddress.base58;
                }, 200);
            }, 100);
        },
        methods: {
            getTronWeb() {
                return new Promise((resolve, reject) => {
                    window.tronWeb ? resolve(window.tronWeb) : reject('TronWeb not found');
                });
            }
        }
    };

	window.App = new Vue({
  		mixins: [VueTRON],
		el: '#App',
		data: {
            upline: 'THhKEnmUGX5waDZCwwHQgqhtAnBqU3etAz', // TG3FYPnAkZGTUPTr9SxyedXBbtAhez3Dv8 - Zero address
            contract_address: 'TG3FYPnAkZGTUPTr9SxyedXBbtAhez3Dv8',
            contract: {
                invested: 0,
                withdraw: 0,
                direct_bonus: 0,
                match_bonus: 0
            },
            user: {
            	trx: 0,
                for_withdraw: 0,
                total_invested: 0,
                total_withdrawn: 0,
                total_match_bonus: 0,
                structure: [0,0,0]
            },
            tarifs: [
            	{days: 18, percent: 120},
{days: 19, percent: 123},
{days: 20, percent: 126},
{days: 21, percent: 129},
{days: 22, percent: 132},
{days: 23, percent: 135},
{days: 24, percent: 138},
            	{days: 25, percent: 142},
{days: 26, percent: 145},
{days: 27, percent: 148},
{days: 28, percent: 152},
{days: 29, percent: 155},
{days: 30, percent: 158},
{days: 31, percent: 162},
{days: 32, percent: 165},
{days: 33, percent: 168},
{days: 34, percent: 172},
{days: 35, percent: 175},
{days: 36, percent: 178},
{days: 37, percent: 182},
{days: 38, percent: 185},
{days: 39, percent: 188},
{days: 40, percent: 192},
{days: 41, percent: 195},
{days: 42, percent: 198},
{days: 43, percent: 202},
{days: 44, percent: 206},
            	{days: 45, percent: 211},
{days: 46, percent: 213},
{days: 47, percent: 216},
{days: 48, percent: 218},
{days: 49, percent: 221},
{days: 50, percent: 223},
{days: 51, percent: 226},
{days: 52, percent: 228},
{days: 53, percent: 231},
{days: 54, percent: 233},
{days: 55, percent: 236},
{days: 56, percent: 238},
{days: 57, percent: 241},
{days: 58, percent: 243},
{days: 59, percent: 246},
{days: 60, percent: 248},
{days: 61, percent: 251},
{days: 62, percent: 253},
{days: 63, percent: 256},
{days: 64, percent: 258},
{days: 65, percent: 261},
{days: 66, percent: 263},
{days: 67, percent: 266},
{days: 68, percent: 268},
{days: 69, percent: 271},
{days: 70, percent: 273},
{days: 71, percent: 276},
{days: 72, percent: 278},
{days: 73, percent: 281},
{days: 74, percent: 283},
{days: 75, percent: 285},
{days: 76, percent: 287},
{days: 77, percent: 289},
{days: 78, percent: 291},
{days: 79, percent: 293},
            	{days: 80, percent: 296}
            ],
            calc: {
            	tarif: 0,
            	amount: 10
            },
            events: []
		},
		mounted() {
            let m = location.search.match(/ref=(T[1-9A-HJ-NP-Za-km-z]{33})/i);
            if(m) {
            	this.upline = m[1];
            	document.cookie = "upline=" + this.upline + "; path=/; expires=" + (new Date(new Date().getTime() + 86400 * 365 * 1000)).toUTCString();
            }

            m = document.cookie.match(/upline=(T[1-9A-HJ-NP-Za-km-z]{33})/i);
            if(m) this.upline = m[1];

		    /*if(!document.cookie.match(/coopolice=1/)) {
		    	this.notice('This website uses cookies for functionality, analytics and advertising purposes as described in our Privacy Policy. If you agree to our use of cookies, please continue to use our site.', '007eff', 0).then(() => (document.cookie = 'coopolice=1; Max-Age=31536000; path=/'));
		    }*/

            setInterval(() => {
                this.getContractInfo();
                this.getUserInfo();
            }, 3000);
		},
        watch: {
            'tron.account'() {
                this.getTronWeb().then(tronWeb => {
                    contract = tronWeb.contract(ABI, tronWeb.address.toHex(this.contract_address));

                    this.getContractInfo();
                    this.getEventsList();
                    this.getUserInfo();
                });
            }
        },
		methods: {
            // colors: primary = 007eff; success = 4caf50; warning = fb8c00; error = e53935
            notice(msg, color = '007eff', time = 3000) {
                return new Promise((resolve, reject) => {
                    let wrap = $('<div style="position:fixed; left:calc(50% - 150px); box-shadow:0 5px 25px rgba(0,0,0,0.2); width:320px; top:40px; background:#' + (color ? color : '007eff') + '; border-radius:10px; color:#fff; padding:20px 20px; font:14px/1.2 Tahoma, sans-serif; cursor:pointer; z-index:999999; text-align:center;">' + msg + '</div>')
                        .on('click', () => { wrap.remove(); resolve(); })
                        .appendTo('body');
                    if(time) setTimeout(() => { wrap.remove(); }, time);
                });
            },
            copyText(value) {
                let s = document.createElement('input');
                s.value = value;
                document.body.appendChild(s);

                if(navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                    s.contentEditable = true;
                    s.readOnly = false;
                    let range = document.createRange();
                    range.selectNodeContents(s);
                    let sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    s.setSelectionRange(0, 999999);
                }
                else s.select();

                try { document.execCommand('copy'); this.notice('Link copied to clipboard', '4caf50'); }
                catch (err) { }

                s.remove();
            },
            getContractInfo() {
                this.getTronWeb().then(tronWeb => {
                    if(contract) {
                        contract.contractInfo().call().then(res => {
                        	this.contract.invested = parseFloat(tronWeb.fromSun(res._invested));
                        	this.contract.withdraw = parseFloat(tronWeb.fromSun(res._withdrawn));
                            this.contract.direct_bonus = parseFloat(tronWeb.fromSun(res._direct_bonus));
                        	this.contract.match_bonus = parseFloat(tronWeb.fromSun(res._match_bonus));
                        });
                    }
                });
            },
            getUserInfo() {
                this.getTronWeb().then(tronWeb => {
                    tronWeb.trx.getBalance(this.tron.account).then(res => {
                        this.user.trx = parseFloat(tronWeb.fromSun(res));
                    });

                    if(contract) {
                        contract.userInfo(this.tron.account).call().then(res => {
                            this.user.for_withdraw = parseFloat(tronWeb.fromSun(res.for_withdraw));
                            this.user.total_invested = parseFloat(tronWeb.fromSun(res.total_invested));
                            this.user.total_withdrawn = parseFloat(tronWeb.fromSun(res.total_withdrawn));
                            this.user.total_match_bonus = parseFloat(tronWeb.fromSun(res.total_match_bonus));
                            this.user.structure = res.structure;
                        });
                    }
                });
            },
            getEventsList() {
            	fetch('https://api.shasta.trongrid.io/v1/contracts/TG3FYPnAkZGTUPTr9SxyedXBbtAhez3Dv8/events?event_name=&only_confirmed=true&order_by=block_timestamp%2Cdesc').then(r => r.json()).then(res => {
            		res.data.forEach(v => {
            			this.events.push({
            				time: v.block_timestamp,
            				type: v.event_name,
            				amount: (v.result.amount / 1e6) || 0,
            				tx: v.transaction_id
            			});
            		});
            	});
            },
            deposit(tarif, amount) {
                amount = parseFloat(amount) || 0;
                if(amount >= 10) {
                    this.getTronWeb().then(tronWeb => {
                        this.notice('Confirm transaction', 'fb8c00');
                        contract.deposit(tarif, this.upline).send({
                            callValue: tronWeb.toSun(amount),
                            shouldPollResponse: true
                        }).then(res => {
                            this.getUserInfo();
                            this.notice('Transaction successful', '4caf50');
                        });
                    });
                }
            },
            withdraw() {
                this.getTronWeb().then(tronWeb => {
                    this.notice('Confirm transaction', 'fb8c00');
                    contract.withdraw().send({shouldPollResponse: true}).then(res => {
                        this.getUserInfo();
                        this.notice('Transaction successful', '4caf50');
                    });
                });
            }
		}
	});
})();
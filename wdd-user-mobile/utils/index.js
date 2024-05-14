import {
	Key
} from '../utils/common'
import CryptoJS from '../uni_modules/crypto-js/crypto-js.js'



export function aesEncryptStr(valueObject) {
	let key = CryptoJS.enc.Utf8.parse(Key)
	let encrypted = CryptoJS.AES.encrypt(JSON.stringify(valueObject), key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	})

	let hexStr = encrypted.ciphertext.toString().toUpperCase();
	let oldHexStr = CryptoJS.enc.Hex.parse(hexStr);
	return CryptoJS.enc.Base64.stringify(oldHexStr);
}


export function aesDecryptStr(valueStr) {
	let key = CryptoJS.enc.Utf8.parse(Key)
	let decrypted = CryptoJS.AES.decrypt(valueStr, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	})
	let decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
	return JSON.parse(decryptedStr);
}

export function toBase64(str) {
	return new Buffer(str).toString('base64');
}

export function fromBase64(str) {
	return new Buffer(str, 'base64').toString('utf8')
}


export function lastPageAction(pages, route, action) {
	if (pages.length >= 2) {
		for (let itemPage of pages) {
			if (itemPage.route === route) {
				action(itemPage.$vm)
			}
		}
	}
}


export function formatSeconds(theTime) {
	let theTime1 = 0
	let theTime2 = 0
	if (theTime > 60) {
		theTime1 = parseInt((theTime / 60))
		theTime = parseInt((theTime % 60))
		if (theTime1 > 60) {
			theTime2 = parseInt((theTime1 / 60))
			theTime1 = parseInt((theTime1 % 60))
		}
	}
	let result = `${parseInt(theTime)}秒`
	if (theTime1 > 0) {
		result = `${parseInt(theTime1)}分${result}`
	}
	if (theTime2 > 0) {
		result = `${parseInt(theTime2)}小时${result}`
	}
	return result
}
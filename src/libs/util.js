import Cookies from 'js-cookie'

let util = {}

/**
 * 得到现在的用户
 */
util.uuid = function () {
  return Cookies.get('uuid')
}

/**
 * 打开全屏
 */
util.openFullScreen = function () {
  const body = document.body
  if (body.requestFullscreen) {
    body.requestFullscreen()
  } else if (body.mozRequestFullScreen) {
    body.mozRequestFullScreen()
  } else if (body.webkitRequestFullScreen) {
    body.webkitRequestFullScreen()
  } else if (body.msRequestFullscreen) {
    body.msRequestFullscreen()
  }
}

/**
 * 关闭全屏
 */
util.exitFullScreen = function () {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

/**
 * 在每次打开新页面的时候调用 打开一个新的 tab
 * @param {object} vm vue
 * @param {string} name route name
 * @param {object} argu arguments
 * @param {object} query query object
 */
util.openNewPage = function (vm, name, argu, query) {
  // 已经打开的页面
  let pageOpenedList = vm.$store.state.d2admin.pageOpenedList
  // 判断此页面是否已经打开 并且记录位置
  let pageOpendIndex = 0
  const pageOpend = pageOpenedList.find((page, index) => {
    const same = page.name === name
    pageOpendIndex = same ? index : pageOpendIndex
    return same
  })
  if (pageOpend) {
    // 页面以前打开过
    console.group('page opend')
    console.log('pageOpendIndex: ', pageOpendIndex)
    console.groupEnd()
    // 虽然页面以前打开过
    // 但是新的页面可能 name 一样，参数不一样
    vm.$store.commit('d2adminpageOpenedListUpdateItem', {
      index: pageOpendIndex,
      argu: argu,
      query: query
    })
  } else {
    // 页面以前没有打开过
    console.group('page not opend')
    console.log('pageOpendIndex: ', pageOpendIndex)
    console.groupEnd()
  }
}

export default util

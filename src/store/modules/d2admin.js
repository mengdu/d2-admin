import util from '@/libs/util.js'
import db from '@/libs/db.js'
import themeList from '@/assets/style/theme/list.js'

export default {
  state: {
    // 全屏
    isFullScreen: false,
    // 灰度
    isGrayMode: false,
    // 主题
    themeList,
    themeActive: themeList[1],
    // 多页
    pageOpenedList: [
      {
        name: 'index',
        title: '首页'
      }
    ]
  },
  mutations: {
    /**
     * 更新页面列表上的某一项
     * @param {state} state vuex state
     * @param {info} param1 new page info
     */
    d2adminpageOpenedListUpdateItem (state, { index, argu, query }) {
      // dev
      console.group('d2adminpageOpenedListUpdateItem')
      console.log('index: ', index)
      console.log('argu: ', argu)
      console.log('query: ', query)
      console.groupEnd()
      // 更新页面列表某一项
      let page = state.pageOpenedList[index]
      page.argu = argu || page.argu
      page.query = query || page.query
      state.pageOpenedList.splice(index, 1, page)
      // 更新设置到数据库
      const setting = db.get('pageOpenedList').find({uuid: util.uuid()})
      if (setting.value()) {
        setting.assign({value: state.pageOpenedList}).write()
      } else {
        db.get('pageOpenedList').push({
          uuid: util.uuid(),
          value: state.pageOpenedList
        }).write()
      }
    },
    /**
     * 切换全屏
     * @param {state} state vuex state
     */
    d2adminFullScreenToggle (state) {
      if (state.isFullScreen) {
        util.exitFullScreen()
        state.isFullScreen = false
      } else {
        util.openFullScreen()
        state.isFullScreen = true
      }
    },
    /**
     * 切换灰度状态
     * @param {state} state vuex state
     */
    d2adminGrayModeToggle (state) {
      state.isGrayMode = !state.isGrayMode
    },
    /**
     * 设置灰度模式
     * @param {state} state vuex state
     * @param {boolean} value new value
     */
    d2adminGrayModeSet (state, value) {
      state.isGrayMode = value
    },
    /**
     * 激活一个主题（应用到dom上）
     * @param {state} state vuex state
     * @param {string} themeActiveValue 需要激活的主题名称
     */
    d2adminThemeSet (state, themeActiveValue) {
      // 从列表里找到需要激活的主题的数据
      const theme = state.themeList.find(e => e.value === themeActiveValue) || state.themeList[0]
      // 设置 state
      state.themeActive = theme
      // 设置 dom
      document.body.className = `theme-${state.themeActive.value}`
      // 保存到数据库
      this.commit('d2adminThemeSave', themeActiveValue)
    },
    /**
     * 从数据库加载主题设置
     * @param {state} state vuex state
     */
    d2adminThemeLoad (state) {
      const themeActive = db.get('themeActive').find({uuid: util.uuid()}).value()
      this.commit('d2adminThemeSet', themeActive ? themeActive.value : state.themeList[0].value)
    },
    /**
     * 向数据保存一个主题
     * @param {state} state vuex state
     * @param {string} themeActiveValue 需要保存的主题名称
     */
    d2adminThemeSave (state, themeActiveValue) {
      // 检查这个用户是否有主题设置
      const setting = db.get('themeActive').find({uuid: util.uuid()})
      if (setting.value()) {
        setting.assign({value: themeActiveValue}).write()
      } else {
        db.get('themeActive').push({
          uuid: util.uuid(),
          value: themeActiveValue
        }).write()
      }
    }
  }
}

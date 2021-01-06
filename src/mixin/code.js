import { v4 as uuidv4 } from 'uuid'

import { getCode } from '@/api/login'

export default {
  data () {
    return {
      svgCode: '',
      sid: ''
    }
  },
  methods: {
    _getCode () {
      const localSid = localStorage.getItem('sid')
      if (localSid) {
        this.sid = localSid
      } else {
        this.sid = uuidv4()
        localStorage.setItem('sid', sid)
      }
      getCode(this.sid).then(res => {
        if (res.code === 10000) {
          this.svgCode = res.data.svg
        }
      })
    }
  },
  mounted () {
    this._getCode()
  }
}

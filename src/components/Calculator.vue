<template>
  <div>
    <h1>OGRUZKI</h1>
    <section>
      <h3>TYT SMS CLOUD</h3>
      <div class="account" v-if="joined">
        <img v-if="src" src="@/assets/god.jpg" alt="avatar">
        <img v-else src="@/assets/pidr.jpg" alt="avatar">
        <span>{{ user.name }}</span>
        <small>{{ user.position }}</small>
        <el-row>
          <el-button type="success" icon="el-icon-message" :disabled="formExist" circle @click.prevent="showForm"></el-button>
          <el-button icon="el-icon-switch-button" circle type="danger" @click.prevent="sebat"></el-button>
        </el-row>
      </div>
      <div class="ogruzochki" v-if="joined">
        <h2>Огрызки в сети:</h2>
        <div class="over">
          <div class="ogryzok" v-for="ogryzok in ogruzki" :key="ogryzok.id">
          <img v-if="ogryzok.avatar == 'GOD'" src="@/assets/god.jpg" alt="avatar">
          <img v-else src="@/assets/pidr.jpg" alt="avatar">
          <div class="data">
            <div class="name">Имя Огрызка: <span>{{ ogryzok.name }}</span></div>
            <div class="position">Специальность: <small>{{ ogryzok.position }}</small></div>
          </div>
        </div>
        </div>
      </div>
      <el-form :model="user" @submit.prevent.native="join('user')" v-if="!joined" :rules="rules" ref="user">
        <el-form-item label="Поганяло" prop="name">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="Ты кто по жизни?" prop="position">
          <el-radio-group v-model="user.position">
            <el-radio label="PHP"></el-radio>
            <el-radio label="JS"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="join('user')">Законектиться</el-button>
        </el-form-item>
      </el-form>
    </section>
    <section>
      <div class="calculator">
        
      </div>
    </section>
    <section class="sms-grid" v-if="joined">
      <el-tag :type="message.color" v-for="message in sms" :key="message.id" closable @close="removeSMS(message.id)">
        {{ message.text }}
      </el-tag>
    </section>
    <el-form :model="smsHolder" @submit.prevent.native="sendSMS('smsHolder')" v-if="joined && formExist" :rules="rules2" ref="smsHolder" class="smsbottom">
      <el-button icon="el-icon-close" class="form-hider" circle type="danger" @click.prevent="hideForm"></el-button>
      <el-form-item  prop="text">
          <el-input placeholder="Напиши Какой-то Хуеты" v-model="smsHolder.text"></el-input>
      </el-form-item>
      <el-form-item label="Выбери цвет смс" prop="color">
        <el-radio-group v-model="smsHolder.color">
          <el-radio label="primary">Blue</el-radio>
          <el-radio label="success">Green</el-radio>
          <el-radio label="info">Grey</el-radio>
          <el-radio label="warning">Orange</el-radio>
          <el-radio label="danger">Red</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendSMS('smsHolder')">Послать</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      joined: false,
      formExist: false,
      smsHolder: {
        id: null,
        text: '',
        color: ''
      },
      user: {
        id: null,
        name: '',
        position: '',
        avatar: '',
      },
      ogruzki: [],
      sms: [],
      rules: {
        name: [
          { required: true, message: 'Впиши свое поганяло, пидор!', trigger: 'blur' },
          { min: 3, max: 40, message: 'Длина поганяла от 3х до 40 символов, пидор!', trigger: 'blur' }
        ],
        position: [
          { required: true, message: 'Укажи кто ты по масти, пидор!', trigger: 'change' }
        ]
      },
      rules2: {
        text: [
          { required: true, message: 'Впиши свое смс, пидор!', trigger: 'blur' },
          { min: 3, max: 20, message: 'Длина смс от 3х до 20 символов, пидор!', trigger: 'blur' }
        ],
        color: [
          { required: true, message: 'Укажи цвет смс, пидор!', trigger: 'change' }
        ]
      },
      socket: io('https://kalkulate.herokuapp.com/') // io('localhost:5000')
    }
  },
  created() {
    window.addEventListener('beforeunload', this.sebat)
  },
  mounted() {
    this.socket.on('state', data => {
      this.ogruzki =  data
    })
    this.socket.on('state2', data => {
      this.sms = data
    })
  },
  watch: {
    position(val) {
      this.user.avatar = 'PIDOR'
      if (val == 'JS') {
        this.user.avatar = 'GOD'
      }
      if (val != ' ') {
        this.user.id = Date.now()
      }
    }
  },
  computed: {
    src() {
      if (this.user.position == 'JS') {
        return true
      } else {
        return false
      }
    },
    position() {
      return this.user.position
    }
  },
  methods: {
    showForm() {
      this.formExist = true
    },
    hideForm() {
      this.formExist = false
    },
    join(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.socket.emit('join', {
            id: this.user.id,
            name: this.user.name,
            position: this.user.position,
            avatar: this.user.avatar
          })
          this.joined = true
        } else {
          this.joined = false
          this.$alert('Слышь, пидрила. Соберись нахуй', 'Обнаружен Пидор', {
          confirmButtonText: 'OK',
          callback: () => {
            this.$message({
              type: 'error',
              message: 'Постарайся не быть пидором и заполни поля'
            });
          }
        });
        }
      })
    },
    sendSMS(formName) {
      this.smsHolder.id = Date.now()
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.socket.emit('sms', {
            id: this.smsHolder.id,
            text: this.smsHolder.text,
            color: this.smsHolder.color
          })
          this.smsHolder.id = null
          this.smsHolder.text = ''
          this.smsHolder.color = ''
        } else {
          this.$alert('Слышь, пидрила. Соберись нахуй', 'Обнаружен Пидор', {
          confirmButtonText: 'OK',
          callback: () => {
            this.$message({
              type: 'error',
              message: 'Постарайся не быть пидором'
            });
          }
        });
        }
      })
    },
    sebat() {
      this.socket.emit('sebat', {
        name: this.user.name,
        id: this.user.id
      })
      this.joined = false
      this.user.name = ''
      this.user.id = ''
      this.user.position = ''
    },
    removeSMS(id) {
      this.socket.emit('deleteSMS', {
        id: id
      })
    }
  },
  destroyed() {
    this.sebat()
  }
}
</script>

<style>
.el-form {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    padding: 50px;
    background: #000;
    border-radius: 10px;
}
.form-hider {
    position: absolute;
    top: -25px;
    left: 25px;
}
.el-form-item__label {
    color: #fff;
}
.account img {
    width: 100px;
    border-radius: 50%;
    margin: auto;
}

.account {
    position: fixed;
    top: 20px;
    left: 20px;
    text-align: center;
}

.account span {
    display: block;
    margin: 10px 0 5px;
    text-transform: uppercase;
    font-weight: 900;
    line-height: 1;
}

.account small {
    color: #fff;
    font-weight: 700;
    font-size: 12px;
    position: absolute;
    top: 0;
    right: 0;
    background: red;
    padding: 5px;
}
.ogruzochki {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 30%;
}

.ogryzok {
    display: flex;
    flex-wrap: wrap;
}

.ogryzok img {
    width: 55px;
    border-radius: 50%;
    flex: 0 0 55px;
}
.ogruzochki {
    text-align: left;
}
.ogruzochki {
    text-align: left;
}

.data {
    flex: 0 0 calc(100% - 55px);
    padding-left: 20px;
    box-sizing: border-box;
}

.ogryzok {
    align-items: center;
    padding: 10px 20px;
}

.ogryzok:nth-child(even) {
    background: #eee;
}

.ogruzochki {
    padding: 15px;
    background: #ccc;
}

body {
    margin: 0!important;
}

.ogruzochki .over {
    max-height: calc(100% - 80px);
    overflow-y: auto;
    margin-left: -15px;
    margin-right: -15px;
}
.el-form.smsbottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding-bottom: 0;
    border-radius: 0;
}
</style>

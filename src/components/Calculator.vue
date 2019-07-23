<template>
  <div>
    <h1>OGRUZKI</h1>
    <section>
      <h3>Calculiryem dostavky online</h3>
      <div class="account" v-if="joined">
        <img v-if="src" src="@/assets/god.jpg" alt="avatar">
        <img v-else src="@/assets/pidr.jpg" alt="avatar">
        <span>{{ user.name }}</span>
        <small>{{ user.position }}</small>
        <el-button type="danger" @click.prevent="sebat">Сьебать</el-button>
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
      <el-form :model="user" @submit.prevent.stop="join('user')" v-if="!joined" :rules="rules" ref="user">
        <el-form-item label="Поганяло" prop="name">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="Ты кто по жизни?" prop="position">
          <el-radio-group v-model="user.position">
            <el-radio label="PHP"></el-radio>
            <el-radio label="JS"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" @click.prevent.stop="join('user')">Законектиться</el-button>
      </el-form>
    </section>
    <section>
      <div class="calculator">
        
      </div>
    </section>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      joined: false,
      user: {
        id: null,
        name: '',
        position: '',
        avatar: '',
      },
      ogruzki: [],
      rules: {
        name: [
          { required: true, message: 'Впиши свое поганяло, пидор!', trigger: 'blur' },
          { min: 3, max: 40, message: 'Длина поганяла от 3х до 40 символов, пидор!', trigger: 'blur' }
        ],
        position: [
          { required: true, message: 'Укажи кто ты по масти, пидор!', trigger: 'change' }
        ]
      },
      socket: io('https://kalkulate.herokuapp.com/')
    }
  },
  created() {
    window.addEventListener('beforeunload', this.sebat)
  },
  mounted() {
    this.socket.on('state', data => {
      this.ogruzki =  data
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
    sebat() {
      this.socket.emit('sebat', {
        name: this.user.name,
        id: this.user.id
      })
      this.joined = false
      this.user.name = ''
      this.user.id = ''
      this.user.position = ''
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
</style>

<template>
  <div class="Flex">
    <div
      class="Flex"
      :style="{
        width: '280px',
        height: '100%',
        position: 'relative',
        padding: '0 10px 0 10px'
      }"
    >
      <div :style="{ position: 'absolute' }">
        <transition
          name="fade"
          mode="out-in"
        >
          <div
            v-if="alertList[0]"
            :key="alertList[0].timestamp"
            class="Flex"
          >
            <img
              src="../RetroCoin.png"
              :style="{ height: '50px', 'image-rendering': 'pixelated', 'margin-right': '5px' }"
            >
            <span
              :style="{
                'font-size': '28px',
                color: '#7FFF00',
                'font-weight': 600,
                'background-color': 'rgba(0,0,0,0.6)',
                padding: '4px 8px',
                'border-radius': '10px',
              }"
            >
              {{ alertList[0] ? alertList[0].amount : '$0' }}
            </span>
          </div>
        </transition>
      </div>
    </div>
    <div
      id="Total"
      class="Flex"
    >
      <audio ref="SFX">
        <source
          src="./sfx/mario_coin.mp3"
          type="audio/mpeg"
        >
      </audio>
      <span
        v-for="(char, i) in totalSplitString"
        :key="i"
        :class="(char === ',' ? 'Comma' : undefined)"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script>
import { TweenLite } from 'gsap';
import { formatUSD } from '../../_misc/helpers';

const totalRep = nodecg.Replicant('donationTotal');

export default {
  name: 'Total',
  data() {
    return {
      init: false,
      total: -1,
      tweenedTotal: -1,
      totalSplitString: [],
      alertList: [],
      playingAlerts: false,
    };
  },
  watch: {
    total(newVal, oldVal) {
      if (this.init) {
        this.alertList.push({
          total: newVal, amount: '€'+ (newVal - oldVal).toFixed(2), timestamp: Date.now(),
        });
        if (!this.playingAlerts) {
          this.playNextAlert(true);
        }
      } else {
        this.tweenedTotal = this.total;
        this.init = true;
      }
    },
    tweenedTotal(val) {
      var string = `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
	        string = string.replace(/\$/gi, "€");
      this.totalSplitString = string.split('');
    },
  },
  async mounted() {
    totalRep.on('change', (newVal) => {
	console.log(newVal);
      this.total = newVal;
    });

    // Keep the SFX playing constantly but on mute to avoid garbage collection (hopefully).
    //this.$refs.SFX.muted = true;
    //await this.$refs.SFX.play();
    //this.$refs.SFX.addEventListener('ended', async () => {
    //  this.$refs.SFX.muted = true;
    //await this.$refs.SFX.play();
    //});
  },
  methods: {
    async playNextAlert(start = false) {
      this.playingAlerts = true;
      if (!start) {
        await new Promise((res) => setTimeout(res, 500));
      }
      //this.playSound();
      await new Promise((res) => setTimeout(res, 500));
      TweenLite.to(this.$data, 5, { tweenedTotal: this.alertList[0].total });
      window.setTimeout(() => {
        this.alertList.shift();
        if (this.alertList.length) {
          this.playNextAlert();
        } else {
          this.playingAlerts = false;
        }
      }, 6000);
    },
    async playSound() {
      try {
        await this.$refs.SFX.pause();
        this.$refs.SFX.currentTime = 0;
        await this.$refs.SFX.play();
        this.$refs.SFX.muted = false;
      } catch (err) {
        // catch
      }
    },
  },
};
</script>

<style scoped>
  #Total {
    padding: 0 13px 0 0;
    font-size: 40px;
    font-weight: 500;
    min-width: 100px;
    text-align: right;
    float: right;
    padding-right:300px;
  }

  /* Each character in the total is in a span; setting width so the numbers appear monospaced. */
  #Total > span {
    display: inline-block;
    text-align: center;
  }
  #Total > .Comma {
    display: inline-block;
    width: 0.22em;
    text-align: center;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter, .fade-leave-to
  /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

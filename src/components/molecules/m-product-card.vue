<template>
  <div class="m-product-card">
  	<template v-if="itemType !== 'template'">
      <img v-if="item.imagePreview" class="backgroundImage" :src="item.imagePreview">
      <img v-else-if="item.pictures?.length" class="backgroundImage" :src="getUrl(item.pictures[0].filePath)">
  	  <img v-else-if="item.picture" class="backgroundImage" :src="getUrl(item.picture.filePath)">
  	  <div class="data">
        <div class="data__text">
    	    <h4 class="data__name">{{item.name ? item.name : item.product_name}}</h4>
    	    <p class="data__description">
            {{itemType == 'subscription' ? item.description : item.short_description}}
          </p>
        </div>
  	    <div v-if="itemType == 'subscription'" class="data__disciplines">
  	  	  <p class="data__disciplines--title">You'll have access to:</p>
  	  	  <div class="data__disciplines--item-container">  
  	  	    <span class="data__disciplines--item" v-for="(discipline, i) in item.disciplines" :key="i">
  	  	      {{ discipline.name }}
  	  	    </span>
  	  	  </div>
  	    </div>
        <div v-if="itemType == 'discipline'">
          <p class="long_desc">{{item.long_description}}</p>
        </div>
        <div v-if="itemType == 'equipment'" class="long_desc">
          <div class="data__disciplines">
            <p class="data__disciplines--title">Goals:</p>
            <span>{{ item.goals }}</span>
          </div>
          <div class="data__disciplines">
            <p class="data__disciplines--title">Positioning:</p>
            <span>{{ item.positioning }}</span>
          </div>
          <div class="data__disciplines">
            <p class="data__disciplines--title">Execution:</p>
            <span>{{ item.execution }}</span>
          </div>
        </div>
  	    <div class="data__info">
  	  	  <div v-if="itemType == 'subscription'" class="data__duration">
  	  		<img src="@/assets/icons/wall-clock.png">
  	  		<span>{{item.duration + ' days'}}</span>
  	  	  </div>
  	  	  <span v-if="itemType == 'subscription'" class="data__price"><span v-if="qty">{{`${qty} x `}}</span>{{`${item.price ? item.price : item.product_price} Lei`}}</span>
  	  	  <div v-if="editBtn" class="data__actions">
  	  	  	<span @click="$emit('edit')">Edit</span>
  	  	  	<span @click="$emit('delete')">Delete</span>
  	  	  </div>
          <div v-if="status" class="data__actions">
            <p :class="item.valid ? 'activeStatus' : 'expiredStatus'">{{ item.valid ? 'Active' : 'Expired' }}</p>
          </div>
          <div v-if="cart" class="data__actions">
            <p class="cartBtn" @click="addToCart">Add to cart</p>
            <p class="cartBtn" @click="item.favorite ? deleteFavourite(item._id) : addFavourite(item._id)">{{ item.favorite ? 'Remove from wishlist' : 'Add to wishlist'}}</p>
          </div>
          <div v-if="collected" class="data__actions">
            <p class="deleteCart" @click="deleteProduct(item._id)">Delete</p>
          </div>
  	    </div>
  	  </div>
  	</template>
  	<template v-if="itemType == 'template'">
  	  <div class="data">
  	  	<p class="data__template" @click="$emit('add')">{{ name }}</p>
  	  </div>
  	</template>
  </div>
</template>
<script>
import config from '../../store/resources/endpoints/subscriptions.json'
import { mapActions } from 'vuex'

export default {
  props: {
  	item: {
  	  type: Object,
  	  default: () => ({})
  	},
    qty: {
      type: Number,
      default: null
    },
    total: {
      type: Number,
      default: null
    },
  	itemType: {
  	  type: String,
  	  default: ''
  	},
    editBtn: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'Add'
    },
    status: {
      type: Boolean,
      default: false
    },
    cart: {
      type: Boolean,
      default: false
    },
    collected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions({
      addSubscription: 'addProduct',
      addFavourite: 'addFavouriteSubscription',
      deleteProduct: 'deleteProduct',
      deleteFavourite: 'deleteFavouriteSubscription',
    }),
  	getUrl (name) {
  		return config.api + name
  	},
    addToCart () {
      this.addSubscription(this.item._id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.backgroundImage {
  position: absolute;
  height: 100%;
  top: 0;
  right: 5%;
  // transform: translateX(-50%);
}
.m-product-card {
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, .35);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, .65);
    &:hover {
      background: rgba(255, 255, 255, .85);
    }
  }
  position: relative;
  // max-width: 33.33%;
  height: 10rem;
  @include for-mobile {
    height: 14rem;
  }
  overflow: hidden;
  border-radius: 12px;
  .data {
  	position: absolute;
    top: 0;
    height: calc(100% - 2rem);
    left: 0;
    color: var(--c-white);
    padding: var(--spacer-sm);
    background: rgba(0, 0, 0, 0.5);
    width: calc(100% - var(--spacer-lg));
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &__text {
      @include for-mobile {
        max-width: 50%;
      }
    }
  	&__name {
  	  text-transform: uppercase;
      margin: 0;
  	}
  	&__description {
  	  margin: 0;
      font-size: var(--font-xs);
      max-height: 28px;
      overflow: hidden;
      color: var(--c-white);
      opacity: .65;
  	}
  	&__disciplines {
  	  margin-top: var(--spacer-xs);
  	  &--title {
    	 	margin: 0;
    		font-size: var(--font-sm);
    		font-weight: var(--font-semibold);
  	  }
  	  &--item {
        display: block;
  	  	padding: var(--spacer-2xs) var(--spacer-xs);
  	    background: var(--c-primary);
  	    font-size: var(--font-2xs);
  	    text-transform: uppercase;
  	    border-radius: 4px;
        margin: var(--spacer-2xs);
  	    &:first-child {
  	      margin-left: 0;
  	    }
        &-container {
          display: flex;
          flex-wrap: wrap;
        }
  	  }
  	}
  	&__info {
  	  display: flex;
  	  justify-content: space-between;
  	  align-items: center;
  	  margin-top: var(--spacer-sm);
  	}
  	&__duration {
  	  display: flex;
  	  height: 1rem;
  	  img {
  	  	position: relative;
  	  	width: 1rem;
  	  	filter: invert(1);
  	  	margin-right: var(--spacer-xs);
  	  }
  	  span {
  	  	font-size: var(--font-sm);
    	  font-weight: var(--font-bold);
  	  }
  	}
  	&__price {
  	  height: 1rem;
	  font-size: var(--font-sm);
	  font-weight: var(--font-bold);
  	}
  	&__actions {
  	  position: absolute;
  	  top: var(--spacer-sm);
  	  right: var(--spacer-sm);
  	  font-size: var(--font-2xs);
  	  text-transform: uppercase;
      p {
        margin: 0;
        padding: var(--spacer-2xs) var(--spacer-sm);
        font-weight: var(--font-semibold);
        border-radius: 4px;
      }
  	  span {
  	  	display: block;
  	  	text-align: right;
  	  	cursor: pointer;
  	  	margin: var(--spacer-xs) 0;
  	  	color: var(--c-light-darken);
  	  	&:last-child {
  	  	  color: var(--c-danger-lighten);
  	  	}
  	  	&:first-child {
  	  	  margin: 0;
  	  	}
  	  	&:hover {
  	  	  text-decoration: underline;
  	  	}
  	  }
  	}
  	&__template {
  	  position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      text-transform: uppercase;
      cursor: pointer;
      &:hover {
      	text-decoration: underline;
      }
  	}
  }
}
.long_desc {
  max-height: 5rem;
  overflow: auto;
  padding-right: var(--spacer-sm);
  font-size: var(--font-sm);
}
.statusSubscription {

}
.activeStatus {
  background: #5cb85c;
  color: #376e37;
}
.expiredStatus {
  background: #d9534f;
  color: #82322f;
}
.cartBtn {
  &:not(:first-child) {
    margin: var(--spacer-2xs) 0 !important;
  }
  background: var(--c-primary);
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: .3s;
  &:hover {
    background: var(--c-primary-darken);
  }
}
.deleteCart {
  background: var(--c-danger);
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: .3s;
  &:hover {
    background: var(--c-danger-darken);
  }
}
</style>
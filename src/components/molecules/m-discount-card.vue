<template>
  <div v-if="type !== 'template'" class="m-discount-card">
    <div class="discount__details">
      <div class="discount__details--info">
        <div class="discount__details--info-first">
          <div class="icon__container">
            <img src="@/assets/icons/discount.png" class="icon">
          </div>
          <div class="discount__details--info-text">
            <p class="discount__name">{{discount.name}}</p>
            <p class="discount__code">{{discount.code}}</p>
          </div>
        </div>  
        <p class="discount__amount">{{discount.type == 'percent' ? `${discount.value}%` : `${discount.value}lei`}}</p>
      </div>
      <div class="discount__details--info">
        <div class="discount__details--qty">
          <p>{{`Available: ${discount.qtyTotal}`}}</p>
          <p>{{`Per customer: ${discount.qtyCustomer}`}}</p>
        </div>
        <div class="discount__details--extra">
          <p>
            Minimum buy: 
            <span
              class="discount__details--extra-value"
              :class="discount.minimumCartTotal == 0 ? 'highlight__danger' : 'highlight__success'"
            >
              {{ `${discount.minimumCartTotal}lei` }}
            </span>
          </p>
          <p>
            Cumulative: 
            <span
              class="discount__details--extra-value"
              :class="!discount.compatibleWithOthers ? 'highlight__danger' : 'highlight__success'"
            >
              {{ discount.compatibleWithOthers ? 'Yes' : 'No' }}
            </span>
          </p>
        </div>
      </div>
      <div class="discount__details--date">
        <div>
          <span>Since:</span>
          <p>{{formatDate(discount.validFrom)}}</p>
        </div>
        <div>
          <span>Until:</span>
          <p>{{formatDate(discount.validTo)}}</p>
        </div>
      </div>
      <div class="discount__details--info">
        <button @click="$emit('edit-discount', discount._id)">Edit</button>
        <button @click="$emit('delete-discount', discount._id)">Delete</button>
      </div>
    </div>
  </div>
  <div v-else class="m-discount-card m-discount-card__template" @click="$emit('add-discount')">
    <h1>Add Discount</h1>
  </div>
</template>
<script>
import config from '../../store/resources/endpoints/discounts.json'

export default {
  props: {
  	discount: {
  	  type: Object,
  	  default: () => ({})
  	},
    type: {
      type: String,
      default: ''
    }
  },
  methods: {
    formatDate (date) {
      let ms = Date.parse(date)

      return new Date(ms).toLocaleString('ro-ro', { day: 'numeric', month: 'numeric', year: 'numeric' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-discount-card {
  @include for-mobile {
    flex: 1 1 calc(100% - 2.5rem);
    max-width: calc(100% - 2.5rem);
  }
  display: flex;
  background: rgba(250, 115, 90, .5);
  padding: var(--spacer-sm);
  margin: var(--spacer-2xs);
  border-radius: 12px;
  flex: 1 1 calc(33.33% - 2.5rem);
  max-width: calc(33.33% - 2.5rem);
  justify-content: space-between;
  &__template {
    justify-content: center !important;
    align-items: center;
    background: var(--c-gray-lighten);
    cursor: pointer;
    &:hover {
      h1 {
        text-decoration: underline;
      }
    }
    h1 {
      font-size: var(--font-lg);
      font-weight: var(--font-semibold);
      text-transform: uppercase;
      color: var(--c-text);
    }
  }
  .icon {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    &__container {
      position: relative;
      width: 1rem;
      height: 1rem;

    }
  }

  .discount {
    &__details {
      width: 100%;
      &--info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-first {
          display: flex;
          align-items: center;
        }
        &-text {
          margin-left: var(--spacer-xs);
        }
        button {
          border: 1px solid var(--c-primary);
          outline: none;
          width: 50%;
          font-size: var(--font-xs);
          margin-top: var(--spacer-sm);
          background: var(--c-primary);
          color: var(--c-white);
          padding: var(--spacer-2xs) 0;
          transition: .3s;
          &:hover {
            background: var(--c-primary-darken);
          }
          &:nth-child(2) {
            background: rgba(250, 115, 90, .15);
            transition: .3s;
            &:hover {
              background: rgba(250, 115, 90, .35);
            }
          }
        }
      }
      &--qty {
        margin-top: var(--spacer-xs);
        p {  
          margin: var(--spacer-2xs) 0;
          font-size: var(--font-xs);
          font-weight: var(--font-medium);
        }
      }
      &--extra {
        margin-top: var(--spacer-xs);
        p {
          margin: var(--spacer-2xs) 0;
          font-size: var(--font-xs);
          font-weight: var(--font-medium);
        }
        &-value {
          padding: 1px 8px;
          border-radius: 20px;
          font-weight: var(--font-semibold);
        }
      }
      &--date {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          margin: var(--spacer-sm) 0 0;
          font-size: var(--font-2xs);
          color: var(--c-primary);
        }
        p {
          margin: 0;
          font-size: var(--font-sm);
          font-weight: var(--font-semibold);
        }
      }
    }
    &__name {
      margin: 0;
      font-size: var(--font-2xs);
      text-transform: capitalize;
      color: var(--c-primary);
    }
    &__code {
      margin: 0;
      font-size: var(--font-sm);
      font-weight: var(--font-semibold);
      text-transform: uppercase;
    }
    &__amount {
      margin: var(--spacer-2xs) 0 0 0;
      font-size: var(--font-lg);
      font-weight: var(--font-semibold);
    }
  }
}
.highlight {
  &__danger {
    background: rgba(217, 83, 79, .75);
    color: #82322f;
  }
  &__success {
    background: rgba(92, 184, 92, .75);
    color: #376e37;
  }
}
</style>
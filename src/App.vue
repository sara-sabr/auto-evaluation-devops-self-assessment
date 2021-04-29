<template>
  <div id="app">
    <i18n path=""></i18n>
    <div>
      <b-modal
        id="modal-1"
        :title="$t('notice.newUserModalTitle')"
        v-model="newUser"
      >
        <p>
          {{ $t("notice.newUserModalBody")
          }}<a :href="$t('notice.newUserModalURL')">{{
            $t("notice.newUserModalURLText")
          }}</a>
        </p>
        <h5>{{ $t("notice.localSaveWarningSummary") }}</h5>
        <p>{{ $t("notice.localSaveWarningParagraph") }}</p>
        <p>
          <strong>{{ $t("notice.exception") }}</strong>
        </p>
        <p>{{ $t("notice.localSaveWarningParagraph2") }}</p>
      </b-modal>
    </div>
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return { newUser: true };
  }
});
</script>

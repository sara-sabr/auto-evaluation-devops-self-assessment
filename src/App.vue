<template>
  <div id="app">
    <i18n path=""></i18n>
    <div>
      <b-modal
        id="welcome-modal"
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
        <b-form-checkbox
          id="checkbox-1"
          v-model="checkbox"
          name="checkbox-1"
          value="true"
          unchecked-value="true"
          size="lg"
        >
          {{ $t("notice.hideNotice") }}
        </b-form-checkbox>
      </b-modal>
    </div>
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return { newUser: true, checkbox: "true" };
  }
});
</script>
0

<template>
  <div>
    <b-modal
      id="welcome-modal"
      :title="$t('notice.newUserModalTitle')"
      v-model="welcomeNotice"
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
        id="checkbox-notice"
        v-model="checkbox"
        name="checkbox-notice"
        value="false"
        unchecked-value="true"
        size="lg"
      >
        {{ $t("notice.hideNotice") }}
      </b-form-checkbox>
    </b-modal>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "BaseNotice",
  data() {
    return { welcomeNotice: true, checkbox: "false" };
  },
  mounted() {
    this.$data.welcomeNotice = true;
  }
});
</script>

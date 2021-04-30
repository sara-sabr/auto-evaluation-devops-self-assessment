<template>
  <div>
    <b-modal id="welcome-modal">
      <template #modal-header>
        <h5>{{ $t("notice.newUserModalTitle") }}</h5>
      </template>
      <template #default>
        <p>
          {{ $t("notice.newUserModalBody")
          }}<a :href="$t('notice.newUserModalURL')" target="_blank">{{
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
          name="checkbox-notice-modal"
          value="true"
          unchecked-value="false"
          size="lg"
        >
          {{ $t("notice.hideNotice") }}
        </b-form-checkbox>
      </template>
      <template #modal-footer>
        <b-button @click="updateNotice">OK</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "BaseNotice",
  data() {
    return { checkbox: "false" };
  },
  computed: {
    displayNoticeStatus() {
      return this.$store.getters.returnDisplayWelcome;
    }
  },
  methods: {
    updateNotice() {
      let displayNotice: boolean;
      if (this.checkbox === "true") {
        displayNotice = false;
      } else {
        displayNotice = true;
      }
      this.$store.commit("updateDisplayNotice", displayNotice);
      this.$bvModal.hide("welcome-modal");
    }
  }
});
</script>

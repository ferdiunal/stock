<template>
<v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
        <v-tooltip bottom>
            <template v-slot:activator="onTool">
                <v-icon class="mr-5" v-on="{...on, ...onTool.on}">
                    mdi-plus-circle-outline
                </v-icon>
            </template>
            <span>Ürün Talebi</span>
        </v-tooltip>
    </template>
    <v-card>
    <v-card-title>
        <span class="headline">{{ name }} Talep Formu</span>
    </v-card-title>
    <v-card-text>
        <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        >
        <v-container>
        <v-row>
            <v-col cols="12">
                <v-text-field :rules="validation.name" label="Talep Edilen Kişinin Adı Soyadı*" v-model.trim="form.name" required />
            </v-col>
            <v-col cols="4">
                <v-text-field :rules="validation.count" type="number" v-model.number="form.count" min="1" :max="count" label="Talep Edilen Ürün Adedi*" required />
            </v-col>
            <v-col cols="12">
            <v-textarea :rules="validation.description" rows="1" v-model.trim="form.description" no-resize single-line auto-grow label="Talep Edilen Ürün Ne İçin Kullanılacak ?*" required />
            </v-col>
        </v-row>
        </v-container>
        <small>* Tüm Alanlar Zorunlu</small>
        </v-form>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey lighten-2" :disabled="loading" text @click.prevent.native="dialog = false">Vazgeç</v-btn>
        <v-btn color="red darken-1" :loading="loading" text @click.prevent.native="save">Kaydet</v-btn>
    </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
export default {
  name: "Assign",
  props: {
      id: String,
      name: String,
      count: Number,
      type: String,
      description: String
  },
  data: () => ({
      dialog: false,
      valid: true,
      loading: false,
      validation: {
        name: [
          v => !!v || 'Ürün Adı Gerekli !'
        ],
        description: [
          v => !!v || 'Ürün Açıklaması Gerekli !'
        ],
        count: [
          v => v > 0 || 'Ürün Adedi Gerekli !'
        ],
      },
      form: {
        name: "",
        count: 1, 
        description: ""
      }
  }),
  watch: {
    dialog(e) {
      if(e) {
        this.form = {
          name: "",
          count: 1, 
          description: ""
        }
      }
    }
  },
  mounted() {},
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$ipc.send("assign:save", JSON.stringify({
          product_id: this.id,
          name: this.form.name.toLocaleUpperCase(),
          count: this.form.count,
          description: this.form.description.toLocaleUpperCase()
        }))
        this.$ipc.on("assign:saved", () => {
          this.loading = false;
          this.dialog = false;
        })
      }
    }
  },
};
</script>

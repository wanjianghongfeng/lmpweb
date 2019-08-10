<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">机构管理列表</p>
      <div class="flexItem text_r">
        <el-select v-model="filter.typeId" placeholder="机构类型" clearable>
          <el-option v-for="item in typeListData"
                     :key="item.organTypeId"
                     :label="item.typeName"
                     :value="item.organTypeId"></el-option>
        </el-select>
        <el-input type="text" placeholder="机构名称" v-model="filter.name" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.parentId" @node-click="orgNodeClick" ref="organTree"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column prop="name" label="机构名称" align='center'></el-table-column>
                <el-table-column prop="code" label="机构编码" align='center'></el-table-column>
                <el-table-column prop="typeId" label="机构类型" align='center' :formatter="typeFormat"></el-table-column>
                <el-table-column label="操作" align='center' width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini"  @click="editRow(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini"  @click="deleteRow(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total'
                               :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
               :close-on-press-escape="false" :modal-append-to-body='false' width="470px">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="机构属性：" prop="licenseNumber">
          <el-select v-model="model.organType" @change="changeOrganType">
            <el-option v-for="item in organTypeData"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="text+'名称：'" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item :label="text+'编码：'" prop="code">
          <el-input autocomplete="off" v-model="model.code" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item :label="text+'简称：'" prop="shortName">
          <el-input autocomplete="off" v-model="model.shortName" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="机构类型：">
          <el-select v-model="model.typeId">
            <el-option v-for="item in typeListData"
                       :key="item.organTypeId"
                       :label="item.typeName"
                       :value="item.organTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋数量：" prop="buildingNumber" v-if="text==='小区'&&!model.id">
          <el-input autocomplete="off" v-model="model.buildingNumber" maxLength="2"></el-input>
        </el-form-item>
        <el-form-item :label="text+'坐标：'">
          <el-popover placement="right" width="500" trigger="click">
            <div style="height: 500px" class="popover">
              <el-amap ref="map" :zoom="map.zoom" :events="map.events">
                <el-amap-marker vid="marker" :position="map.position"></el-amap-marker>
              </el-amap>
            </div>
            <el-input slot="reference" :readonly="true" v-model="map.lnglat" suffix-icon="el-icon-location"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item :label="text+'电话：'" prop="phone">
          <el-input resize="none" type="textarea" :rows="2" placeholder="例:028-88888888;15877777777" maxLength="64"
                    autocomplete="off" v-model="model.phone"></el-input>
        </el-form-item>
        <el-form-item :label="text+'备注：'" prop="note">
          <el-input resize="none" type="textarea" :rows="2" autocomplete="off" v-model="model.note"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {validateBlackSpace } from '../../commom/validator'

  export default {
    name: 'organization',
    components: {OrganTree},
    data() {
      return {
        map: {
          center:[104.07,30.67],
          position:[104.07,30.67],
          lnglat: '',
          zoom: 12,
          events: {
            'click': (e) => {
              this.map.lnglat = e.lnglat.lat + ',' + e.lnglat.lng;
              this.map.position=[e.lnglat.lng,e.lnglat.lat]
              this.model.y = e.lnglat.lat
              this.model.x = e.lnglat.lng
              this.model.zoom = 12
            }
          },
        },
        tabHeight: '0',
        dialogFormVisible: false,
        dialogFormTitle: '',
        text: '机构',
        organType: 1,
        tableData: [],
        typeListData: [],
        model: {},
        total: 0,
        filter: {
          parentId: '',
          name: null,
          typeId: null,
          page: 1,
          rows: 10,
        },
        activeOrg: [],
        firstErr: null,
        loading: false,
        rules: {
          name: [{
            required: true,
            message: '请填写名称',
            trigger: 'blur'
          }, {
            maxLength: 3,
            message: '请填写名称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '名称不能有空格',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: '请选填写编码',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '编码不能有空格',
            trigger: 'blur'
          }],
          shortName: [{
            required: true,
            message: '请填写简称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '简称不能有空格',
            trigger: 'blur'
          }],
          buildingNumber: [{
            required: true,
            message: '请填楼栋数',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '楼栋数不能有空格',
            trigger: 'blur'
          }]
        },
        typeName:[],
        organTypeData: [
          {key: 1, value: "管理机构"},
          {key: 2, value: "业务机构"}
        ]
      }
    },
    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      })
      this.filter.parentId = JSON.parse(localStorage.getItem('user')).organId;
      this._fetchOrganType();
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.organList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      _fetchOrganType: debounce(async function () {
        const data = await Api.getOrganTypeList.get().then(res => res.data)
        this.typeListData = data.result;
      }, 100),
      typeFormat(row, column) {
        let typeName = this.typeListData[0].typeName;
        this.typeListData.forEach(item => {
          if (item.organTypeId === row.typeId) {
            typeName = item.typeName;
            return;
          }
        });
        return typeName;
      },
      //
      editRow(row = {
        organType: 1,
        typeId: 1
      }) {

        if (this.organType == 2) {
          this.$message({message: '管理机构才能新增', type: 'success'});
          return;
        }
        this._fetchOrganType();
        this.dialogFormTitle = !row.id ? '新增' : '编辑'
        this.dialogFormVisible = true

        if(row.id){
          if(row.organType==1)  this.text="机构"
          if(row.organType==2)  this.text="小区"
          if(row.y!=null && row.x!=null){
            this.map.lnglat= row.y+ "," + row.x;
            this.map.position=[row.x,row.y];
          }else {
            this.map.lnglat='';
          }
        }else {
          this.map.lnglat='';
          this.text="机构";
        }
        this.model = cloneDeep(row)
        this.model.parentId = this.filter.parentId
      },

      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addOrgan.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.dialogFormVisible = false
                  this._fetchData()
                  // 重新加载机构树
                  this.$refs.organTree._fetchData();
                }).catch(err => {
                })
            } else {
              await Api.modifyOrgan.put(this.model, {
                pathParams: {
                  id: this.model.id
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.dialogFormVisible = false
                this._fetchData()
                // 重新加载机构树
                this.$refs.organTree._fetchData();
              }).catch(err => {
              })
            }
            this.loading = false
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteOrgan.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
            this._fetchData()
            // 重新加载机构树
            console.log(this.filter.parentId)
            this.$refs.organTree._fetchData();
          }).catch(() => {
            /*this.$message({
              type: 'error',
              message: '删除失败!'
            })*/
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      changeOrganType(val) {
        val == 1 ? this.text = '机构' : this.text = '小区'
      },
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]) {
        this.organType = item.organType;
        this.filter.parentId = item.id || ''
        this._fetchData()
      }
    },
  };
</script>
<style lang="less">

</style>

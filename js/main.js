/**
 * Created by Administrator on 2015/8/22.
 */
var get={ //����IE��ȡclass
    byId:function(id){
        return document.getElementById(id)
    },
    byClass:function(aClass,parent){
        if(document.getElementsByClassName){
            return document.getElementsByClassName(aClass)
        }
        var aParent=parent?get.byId(parent):document,
            Aclass=[],
            elems=aParent.getElementsByTagName("*");

        for(var i= 0,l=elems;i< l.length;i++){
            if(l[i].className == aClass){
                Aclass.push(l[i])
            }
        }
        return Aclass
    },
    byTagName:function(tag,parent){
        return (parent || document).getElementsByTagName(tag)
    }
};

var method={ //�����¼����ܷ�װ
    addEvent:function(obj,type,fn){
        if(document.addEventListener){
            obj.addEventListener(type,fn,false)
        }else if(document.attachEvent){
            obj.attachEvent("on"+type,fn)
        }
        obj["on"+type]=fn;
    },
    removeEvent:function(obj,type,fn){
        if(document.removeEventListener){
            obj.removeEventListener(type,fn)
        }else if(document.detachEvent){
            obj.detachEvent("on"+type,fn)
        }
        obj["on"+type]=null;
    }
};

window.onload=function(){
    var body=get.byTagName("body")[0];
    var wrap=get.byId("wrap")  ;
    var page=get.byClass("page");
    var h=null;//���ڴ�ŵ�ǰ���ڸ߶�
    var menu=get.byClass("menu")[0];
    var nodes=[];//���ڴ���Զ����ɵ�li��ǩ
    var nextIndex=0;//��ʾ��� ��� or ���� Ҫ���������ֵ
    var nowTop=0;//��ǰwrap��topֵ
    var nextTop=0;//wrap����������topֵ
    var playing=true;//�����ж�page�Ƿ����ڹ�������
    var timer=null;//��������
    var speed=null;//�����ٶ�

    //����li��ǩ
    for(var i=0;i<page.length;i++){
        nodes[i]=document.createElement("li");
        nodes[i].index=i;
        menu.appendChild(nodes[i]);
        nodes[i].onclick=function(){
            win.storeTop();//���浱ǰtopֵ
            nextIndex=this.index;//��ȡ�������ǩ������ֵ ע���ڵ���storeTop()֮��
            win.animate();//��ʼ����
        }
    }
    //Ϊ��һ��li�����ʽ
    if(page.length>0){
        nodes[0].className=nodes[0].className==""?"active":nodes[0].className+" active";
        //�������Ҳ�����calssName�Ĺ���,���ܺܺü���IE�Ͳ�����
        //nodes[0].classList.add("active")
    }
    var win={
        changeBodyHeight:function(){//����body�߶ȵ���������Ŀɼ��߶�
            h=document.documentElement.clientHeight || document.body.clientHeight;
            body.style.height=h+"px";
        },
        changePageHeight:function(){//����ÿһ��page�ĸ߶ȱ�����bodyһ��
            for(var i=0;i<page.length;i++){
                page[i].style.height=h+"px";
            }
        },
        storeTop:function(){//���滬��ǰ��topֵ
            nowTop=nextIndex*h;
        },
        animate:function(){
            if(!playing){//��������л�page,�����²���
                return false
            }
            nextTop=nextIndex*h;//��ȡĿ���topֵ
            if(nextTop == nowTop){ //������ͬһ��li,�����²���
                return false
            }
            playing=false;//���˶�״̬���Ϊfalse
            timer=setInterval(function(){
                if(nextTop > nowTop){//������ ֻҪ��ס��ʼtopֵΪ0,���»������ǰ�top�为ֵ���������
                    speed -=30;
                    (speed < -nextTop)&&(speed = -nextTop)//���speed��ֵ����Ŀ��ֵ,��������ΪĿ��ֵ
                }else{
                    speed +=30;
                    (speed > -nextTop)&&(speed = -nextTop)
                }
                wrap.style.top=speed+"px";
                if(speed == -nextTop){//���speed����Ŀ��ֵֵ �˳���ʱ��
                    clearInterval(timer);
                    playing=true;//�ָ�play��ֵ
                    for(var i=0;i<nodes.length;i++){//���li����ʽ
                        nodes[i].className=nodes[i].className==""?"":nodes[i].className.replace(/active|\sactive|active\s|\sactive\s/i,"")
                    }
                    nodes[nextIndex].className="active"//ΪĿ��li�����ʽ
                }
            },10)
        },
        ScrollEvent:function(e){
            if(e.addEventListener){
                method.addEvent(e,"DOMMouseScroll",win.scrollFnc)//���ǻ������껬���¼�
            }
            e.onmousewheel=win.scrollFnc;//��������������Ļ����¼�
        },
        scrollFnc:function(e){
            if(!playing){
                return false
            }
            var e=e||window.event;
            var t=null;
            win.storeTop();
            if(e.wheelDelta){//IE,�ȸ��
                t= e.wheelDelta;
                //���Ϲ� tΪ��ֵ,����ֵ-1
                //���¹� tΪ��ֵ,����ֵ+1
                t>0?nextIndex--:nextIndex++;
            }else if(e.detail){//���
                t= e.detail;
                //������������෴
                //���Ϲ� tΪ��ֵ,����ֵ-1
                //���¹� tΪ��ֵ,����ֵ+1
                t<0?nextIndex--:nextIndex++;
            }
            win.changeIndex();//��ֹ����ҳ��
            win.animate();
            //��ֹĬ���¼�
            e.preventDefault();
        },
        changeIndex:function(){
            nextIndex=nextIndex>=page.length?page.length-1:nextIndex;//���������һ��,���������һ���������»���
            nextIndex=nextIndex<0?0:nextIndex;//��������һ��,�����ڵ�һ���������ϻ���
        }
    };
    win.changeBodyHeight();
    win.changePageHeight();
    win.ScrollEvent(document);
    window.onresize=function(){//��������ڳߴ緢���仯ʱ�Զ�����ҳ��ĳߴ�
        setTimeout(function(){
            win.changeBodyHeight();
            win.changePageHeight();
            wrap.style.top= -(nextIndex*h)+"px"
        },500);
    }
};
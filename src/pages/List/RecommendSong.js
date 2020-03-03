import React, { Component } from 'react';

// import { recommendSongs } from '../../api/api'
// import { RAGet } from '../../api/network'
import { FormatNum, isEmpty, } from '../../utils/format'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom'
import More from '../../components/More/More'
import { changeStatus, getMusicList, changeIndex } from '../../store/actions'

import './RecommendSong.scss'
class recommendSong extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: NaN,//0 默认第一个li高亮   NaN 默认不高亮
            title: false,
            listInfoHeight: 0,
            opcityState: 0,
            thisDate: '',
            moreData: {},
            moreStatue: false,
            moreIndex: 0,
        }
    }
    //播放全部
    allPlay = () => {
        const { playerList } = this.props
        this.props.getMusicList(playerList)
        this.props.changeIndex(0)
        this.setState({ active: 0 })
        this.props.changeStatus(true)
    }
    addPlay = (index) => {
        var ra = true
        const { playList, playerList } = this.props
        const musicId = playerList[index].id
        playList.forEach((e, i) => {
            if (e.id === musicId) {
                ra = false
                this.props.changeIndex(i)
                return false
            }
        })
        if (ra) {
            const newPlayList = JSON.parse(JSON.stringify(playList))
            newPlayList.unshift(playerList[index])
            this.props.getMusicList(newPlayList)
            this.props.changeIndex(0)
        }
        this.setState({ active: index })
        this.props.changeStatus(true)
    }
    handleScroll = () => {
        let opcityState = (window.scrollY / this.state.listInfoHeight).toFixed(1)
        this.setState({
            title: window.scrollY > this.state.listInfoHeight * 0.75 ? true : false,
            opcityState: opcityState
        })
    }
    equal = () => {
        const { playList, index, playerList } = this.props
        var showStyStatus = true;
        if (!isEmpty(playList) && (playerList)) {
            playerList.forEach((e, i) => {
                if (e.id === playList[index].id) {
                    showStyStatus = false;
                    this.setState({ active: i })
                }
                if (showStyStatus) {
                    this.setState({ active: NaN })
                }
            });
        }
    }
    componentWillReceiveProps = () => {
        this.equal();
    }
    gotoMv = (id, e) => {
        this.props.history.push({ pathname: '/videoDetails' + id });
        e.stopPropagation();
    }
    openMore = (item, index, e) => {
        this.setState({ moreData: item, moreStatue: true, moreIndex: index })
        e.stopPropagation();
    }
    childStatue = (data) => {
        this.setState({ moreStatue: data })
    }
    componentDidMount() {
        const listInfoHeight = this.refs.listInfo.clientHeight
        this.setState({
            listInfoHeight: listInfoHeight * 0.75
        })
        window.addEventListener('scroll', this.handleScroll);
        let date = new Date();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month < 10 ? '0' + month : month
        day = day < 10 ? '0' + day : day
        this.setState({ thisDate: month + '/' + day })
        // 加载光标
        this.equal()
    }
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        }
    }
    render() {
        const { title, opcityState, thisDate, active, moreData, moreStatue, moreIndex } = this.state
        const { playerList } = this.props
        return (
            <div className="recommend-songs">
                {moreStatue ? <More list={moreData} getStatue={this.childStatue} moreIndex={moreIndex} {...this.props} /> : null}
                <header ref="header" style={{ backgroundColor: 'rgba(244,132,118,' + opcityState + ')' }}>
                    <Link to='/index/home/'>
                        <div className="icon back"></div>
                    </Link>
                    <div className="title">{title ? playerList && playerList.name : '歌单'}</div>
                    <div className="icon share"></div>
                </header>
                <div className="list-info" ref="listInfo">
                    <div>
                        <img src={require('../../assets/img/jpg/b2a.jpg')} alt="" />
                        <p>{thisDate}</p>
                    </div>
                </div>
                <div
                    onClick={this.allPlay}
                    className="icon ply-all"
                >
                    播放全部
                </div>
                <ul className="list">
                    {
                        playerList && playerList.map((item, index) => {
                            const liClass = active === index ? ' liSty' : ''
                            const numClass = active === index ? ' numSty' : ''
                            const mvClass = active === index ? 'icon-mv' : 'icon-mv-sty'
                            const moreClass = active === index ? 'icon-more-sty' : 'icon-more'
                            return (
                                <li
                                    className={'item' + liClass}
                                    key={index}
                                    onClick={this.addPlay.bind(this, index)}
                                >
                                    <div className='lfet'>
                                        <p className={'num' + numClass}>{FormatNum(index)}</p>
                                        <div>
                                            <p>{item.name}</p>
                                            <p>{item.singer.map(item => item.name + '').join(' - ')}</p>
                                        </div>
                                    </div>
                                    <div className='right'>
                                        <div
                                            onClick={this.gotoMv.bind(this, item.mvid)}
                                            className={Number(item.mvid) === 0 ? '' : 'icon ' + mvClass}
                                        ></div>
                                        <div
                                            onClick={this.openMore.bind(this, item, index)}
                                            className={'icon ' + moreClass}
                                        >

                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        playList: state.playList,//音乐列表
        playerList: state.playerList,//音乐列表
        index: state.index,//index
        playStatus: state.playStatus,
        userInfo: state.userInfo,
        activeNum: state.activeNum
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeStatus: bindActionCreators(changeStatus, dispatch),
        getMusicList: bindActionCreators(getMusicList, dispatch),
        changeIndex: bindActionCreators(changeIndex, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(recommendSong);
import React, { Component } from 'react'

import { startLoading } from '../utility/common'
import { fetchGlobalRankings } from '../utility/api'

import LeaderboardLine from "./LeaderboardLine"

var line_count = 10

class Leaderboard extends Component {
    constructor() {
        super()
        this.state = {
            start_rank: 0,
            lines: [],
            loading: 0,
            error_msg: undefined
        }
    }

    componentWillMount() {
        this.getGlobalRankings(this.state.start_rank)
    }
    
    getGlobalRankings(req_state_rank) {
        startLoading(this)
        fetchGlobalRankings(req_state_rank).catch(content => content).then((content) => { 
            content.loading = this.state.loading - 1
            this.setState(content)
        })
    }

    changePage(event, tag){
        event.preventDefault()

        this.getGlobalRankings(this.state.start_rank + 
            (tag === 'previous' ? -line_count : line_count))
    }

    render() { 
        return(
            <div>
                <h1>Global Rankings</h1>
                {this.state.loading > 0 ? <h1>Loading...</h1> :
                <div>
                    <table className="Leaderboard">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Dominance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.lines.map((l, i) => 
                                    <LeaderboardLine key={i} {...l} />
                                )
                            }
                        </tbody>
                    </table>

                    {this.state.start_rank >= line_count ? 
                        <button onClick={(event) => this.changePage(event, 'previous') } disabled={this.state.loading}>Previous</button> : undefined}
                    <button onClick={(event) => this.changePage(event, 'next')} disabled={this.state.loading}>Next</button>  
                </div>}

                <p>{this.state.error_msg}</p> 
            </div>
        )
    }
}

export default Leaderboard
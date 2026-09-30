package com.vuong.communityportalservice.service;

import com.vuong.communityportalservice.dto.VoteCountDto;
import com.vuong.communityportalservice.dto.VoteDto;
import com.vuong.communityportalservice.exception.CustomException;

public interface VoteService {
    void castVote(VoteDto voteDto) throws CustomException;
    VoteCountDto countVotes(Long postId) throws CustomException;
}

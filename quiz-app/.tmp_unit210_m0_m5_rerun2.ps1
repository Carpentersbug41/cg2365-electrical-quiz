$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3000'
function PostJson([string]$url, [hashtable]$body) { $json = $body | ConvertTo-Json -Depth 20; Invoke-RestMethod -Uri $url -Method POST -ContentType 'application/json' -Body $json }
$runsCtx = Invoke-RestMethod -Uri "$base/api/admin/module/runs?unit=210" -Method GET
$versionId = $runsCtx.defaultSyllabusVersionId
$create = PostJson "$base/api/admin/module/runs" @{ syllabusVersionId = $versionId; unit = '210'; chatTranscript = 'Unit 210 rerun tokens' }
$runId = $create.run.id
$m0Req = @{ syllabusVersionId=$versionId; unit='210'; selectedLos=@('LO1','LO2','LO3'); constraints=@{ minimiseLessons=$false; defaultMaxLessonsPerLO=9; maxAcsPerLesson=4; preferredAcsPerLesson=2; maxLessonsOverrides=@{}; level='Level 2'; audience='beginner'}; orderingPreference='foundation-first'; notes=''; chatTranscript='Unit 210 rerun tokens'; replayFromArtifacts=$false }
$m0 = PostJson "$base/api/admin/module/$runId/m0-distill" $m0Req
$m1 = PostJson "$base/api/admin/module/$runId/m1-analyze" @{ replayFromArtifacts = $false }
$m2 = PostJson "$base/api/admin/module/$runId/m2-coverage" @{ replayFromArtifacts = $false }
$m3 = PostJson "$base/api/admin/module/$runId/m3-plan" @{ replayFromArtifacts = $false }
$m4 = PostJson "$base/api/admin/module/$runId/m4-blueprints" @{ replayFromArtifacts = $false }
$m5 = PostJson "$base/api/admin/module/$runId/m5-validate" @{ replayFromArtifacts = $false }
$summary = Invoke-RestMethod -Uri "$base/api/admin/module/runs/$runId" -Method GET
$storedM4 = $summary.artifacts | Where-Object { $_.stage -eq 'M4' } | Select-Object -First 1
[ordered]@{ runId=$runId; m4GeneratedBy=($storedM4.artifact_json.loBlueprintSets | ForEach-Object { "$($_.lo):$($_.generatedBy)" }); m5IssueCodes=($m5.artifact.issues | ForEach-Object { "$($_.severity):$($_.code):$($_.meta.lo)" }) } | ConvertTo-Json -Depth 20
